<?php

require(__DIR__.'/init.php');

$langjson =  file_get_contents('https://translate.yandex.net/api/v1.5/tr.json/detect?key=trnsl.1.1.20151202T065902Z.5c4795fb9dd7025c.383035300cf133b89dcec8cb612e4c30603b0634&text='.$_REQUEST['q']);
$json = (array) json_decode($langjson);
$qrytext = $_REQUEST['q'];

if($json['lang']!=''){
    $enarr = (array) (json_decode(file_get_contents('https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20151202T065902Z.5c4795fb9dd7025c.383035300cf133b89dcec8cb612e4c30603b0634&text='.$_REQUEST['q'].'&lang=en')));
    $dearr = (array) (json_decode(file_get_contents('https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20151202T065902Z.5c4795fb9dd7025c.383035300cf133b89dcec8cb612e4c30603b0634&text='.$_REQUEST['q'].'&lang=de')));
    $ruarr = (array) (json_decode(file_get_contents('https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20151202T065902Z.5c4795fb9dd7025c.383035300cf133b89dcec8cb612e4c30603b0634&text='.$_REQUEST['q'].'&lang=ru')));
    $frarr = (array) (json_decode(file_get_contents('https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20151202T065902Z.5c4795fb9dd7025c.383035300cf133b89dcec8cb612e4c30603b0634&text='.$_REQUEST['q'].'&lang=fr')));
    $qrytext = $enarr['text'][0].' '. $dearr['text'][0].' '.$ruarr['text'][0].' '.$frarr['text'][0];
}

// create a client instance
$client = new Solarium\Client($config);

// get a select query instance
$query = $client->createSelect();

// get the dismax component and set a boost query
$dismax = $query->getDisMax();

//$dismax->setBoostQuery('cat:"graphics card"^2');

if($json['lang']=='ru'){
    $dismax->setQueryFields('text_en^30 text_de^30 text_ru^50 text_fr^30 tweet_hashtags^40');
}elseif($json['lang']=='de'){
    $dismax->setQueryFields('text_en^30 text_de^50 text_ru^30 text_fr^30 tweet_hashtags^40');
}elseif($json['lang']=='fr'){
    $dismax->setQueryFields('text_en^30 text_de^30 text_ru^30 text_fr^50 tweet_hashtags^40');
}else{
    $dismax->setQueryFields('text_en^50 text_de^30 text_ru^30 text_fr^30 tweet_hashtags^40');
}

$query->setQuery($qrytext);

$facetSet = $query->getFacetSet();
$facetSet->createFacetField('tweet_hashtags')->setField('tweet_hashtags')->setMinCount(1);
$facetSet->createFacetField('lang')->setField('lang')->setMinCount(1);
$facetSet->createFacetField('user')->setField('UserName')->setMinCount(2);
$facetSet->createFacetField('location')->setField('location')->setMinCount(2);
// this query is now a dismax query
if(isset($_REQUEST['fq'])){
    $fqstr = '';
    $fqArr = explode('~',$_REQUEST['fq']);
    $fqvalArr = explode('~',$_REQUEST['fqval']);
    for($i=0;$i<sizeof($fqArr);$i++){
        if($i>0 && $i<sizeof($fqArr)){
            $fqstr .= 'AND ';
        }
        $fqstr .= $fqArr[$i].':'.$fqvalArr[$i].' ';
    }
    if(isset($_REQUEST['echo']) && $_REQUEST['echo']=='t'){
        echo $fqstr;
        echo '<br><br>';
    }
    $query->createFilterQuery('facet_qry')->setQuery($fqstr);
}

$query->setStart(0)->setRows(2000);
// this executes the query and returns the result
$resultset = $client->select($query);
$values['status']='False';
$values['tweetcount'] = $resultset->getNumFound();
if($resultset->getNumFound()>0){
    $values['status']='True';
}

$j=0;
$facetsArr_hashtags = array();
$facet_hashtags = $resultset->getFacetSet()->getFacet('tweet_hashtags');
foreach ($facet_hashtags as $value => $count) {
    $facetsArr_hashtags[$j][$value] = $count;
    $j++;
}

$j=0;
$facetsArr_lang = array();
$facet_lang = $resultset->getFacetSet()->getFacet('lang');
foreach ($facet_lang as $value => $count) {
    $facetsArr_lang[$j]['name'] = $value;
    $facetsArr_lang[$j]['count'] = $count;
    $facetsArr_lang[$j]['percentage'] = number_format(($count/intval($values['tweetcount']))*100, 2);;
    $j++;
}

$j=0;
$facetsArr_user = array();
$facet_user = $resultset->getFacetSet()->getFacet('user');
foreach ($facet_user as $value => $count) {
    $facetsArr_user[$j][$value] = $count;
    $j++;
}

$j=0;
$facetsArr_location = array();
$facet_location = $resultset->getFacetSet()->getFacet('location');
foreach ($facet_location as $value => $count) {
    if($value!=""){
        $facetsArr_location[$j][$value] = $count;
        $j++;    
    }
}

$i = 0;
$tweets = array();
$values['msg'] = 'fail';

$negative=0;$positive=0;$neutral=0;
// show documents using the resultset iterator
foreach ($resultset as $document) {
    
    foreach ($document as $field => $value) {
        // this converts multivalue fields to a comma-separated string
        if (is_array($value)) {
            for($j=0;$j<count($value);$j++){
                $tweets[$i][$field][$j] = $value[$j];
            }
        }else{
            $tweets[$i][$field] = $value;
        }
        
        if($field=='sentiment'){
            if(floatval($value)<0){
                $negative++;    
            }
            if(floatval($value)==0){
                $neutral++;
            }
            if(floatval($value)>0){
                $positive++;
            }
        }
    }
    $i++;
}

$values['positive'] = number_format(($positive/intval($values['tweetcount']))*100, 2);
$values['negative'] = number_format(($negative/intval($values['tweetcount']))*100, 2);
$values['neutral'] = number_format(($neutral/intval($values['tweetcount']))*100, 2);
$values['list'] = $tweets;
$values['facets_hashtags'] = $facetsArr_hashtags;
$values['facets_lang'] = $facetsArr_lang;
$values['facets_user'] = $facetsArr_user;
$values['facets_location'] = $facetsArr_location;
$values['msg'] = 'success';
$result = json_encode($values);
print_r($result);
?>