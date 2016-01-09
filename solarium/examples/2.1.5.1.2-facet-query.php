<?php

require(__DIR__.'/init.php');
//htmlHeader();

// create a client instance
$client = new Solarium\Client($config);

// get a select query instance
$query = $client->createSelect();

// get the facetset component
$facetSet = $query->getFacetSet();

$query->setQuery($_REQUEST['q']);

$query->setStart(0)->setRows(2000);
// create a facet query instance and set options
//$facetSet->createFacetQuery('query')->setQuery($_REQUEST['q']);
$facetSet->createFacetField('tweet_hashtags')->setField('tweet_hashtags');
$resultset = $client->select($query);
// this executes the query and returns the result

// display the total number of documents found by solr
//echo 'NumFound: '.$resultset->getNumFound();

// display facet query count
//$count = $resultset->getFacetSet()->getFacet('stock')->getValue();
//echo '<hr/>Facet query count : ' . $count;
$j=0;
$facets = array();
$facet = $resultset->getFacetSet()->getFacet('tweet_hashtags');
foreach ($facet as $value => $count) {
    $facets[$j][$value] = $count;
    $j++;
}

$i = 0;
$tweets = array();
$values['msg'] = 'fail';

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
    }
    $i++;
}
$values['status']='False';
$values['tweetcount'] = $resultset->getNumFound();
if($resultset->getNumFound()>0){
    $values['status']='True';
}
$values['list'] = $tweets;
$values['facets'] = $facets;
$values['msg'] = 'success';
$result = json_encode($values);
print_r($result);
?>