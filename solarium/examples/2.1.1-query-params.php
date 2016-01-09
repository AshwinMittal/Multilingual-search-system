<?php

require(__DIR__.'/init.php');

//htmlHeader();

// create a client instance
$client = new Solarium\Client($config);

// get a select query instance
$query = $client->createSelect();

// set a query (all prices starting from 12)
$query->setQuery($_REQUEST['q']);

// set start and rows param (comparable to SQL limit) using fluent interface
$query->setStart(0)->setRows(2000);

// set fields to fetch (this overrides the default setting 'all fields')
//$query->setFields(array('id','name','price', 'score'));

// sort the results by price ascending
//$query->addSort('price', $query::SORT_ASC);

// this executes the query and returns the result
$resultset = $client->select($query);

// display the total number of documents found by solr
//echo 'NumFound: '.$resultset->getNumFound();

// display the max score
//echo '<br>MaxScore: '.$resultset->getMaxScore();
//print_r($query);
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
//htmlFooter();
