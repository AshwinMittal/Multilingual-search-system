<?php

require(__DIR__.'/init.php');
//htmlHeader();

//echo file_get_contents('https://translate.yandex.net/api/v1.5/tr.json/detect?key=trnsl.1.1.20151202T065902Z.5c4795fb9dd7025c.383035300cf133b89dcec8cb612e4c30603b0634&text=comment allez-vous');

// create a client instance
$client = new Solarium\Client($config);

// get a select query instance
$query = $client->createSelect();

// get the dismax component and set a boost query
$dismax = $query->getDisMax();
//$dismax->setBoostQuery('cat:"graphics card"^2');
$dismax->setQueryFields('text_en^50 text_de^30 text_ru^30 tweet_hashtags^40');
// this query is now a dismax query
$query->setQuery($_REQUEST['q']);

//$output =  shell_exec('');

$query->setStart(0)->setRows(2000);
// this executes the query and returns the result
$resultset = $client->select($query);

$i = 0;
$tweets = array();
$values['msg'] = 'fail';
//print_r($resultset);
// show documents using the resultset iterator
foreach ($resultset as $document) {
    
    /*
    echo '<hr/><table>';

    // the documents are also iterable, to get all fields
    foreach ($document as $field => $value) {
        // this converts multivalue fields to a comma-separated string
        if (is_array($value)) {
            $value = implode(', ', $value);
        }

        echo '<tr><th>' . $field . '</th><td>' . $value . '</td></tr>';
    }

    echo '</table>';
    */
    
    foreach ($document as $field => $value) {
        // this converts multivalue fields to a comma-separated string
        //$j=0;
        if (is_array($value)) {
                //$tweets[$i][$field][0] = sizeof($value);
            for($j=0;$j<count($value);$j++){
                $tweets[$i][$field][$j] = $value[$j];
            }
            
            //$value = implode(', ', $value);
        }else{
            $tweets[$i][$field] = $value;
        }
        //echo '<tr><th>' . $field . '</th><td>' . $value . '</td></tr>';
    }
    $i++;
}
$values['status']='False';
$values['tweetcount'] = $resultset->getNumFound();
if($resultset->getNumFound()>0){
    $values['status']='True';
}
$values['list'] = $tweets;
$values['msg'] = 'success';
$result = json_encode($values);
print_r($result);