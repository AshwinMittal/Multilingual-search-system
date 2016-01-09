<?php

require(__DIR__.'/init.php');
//htmlHeader();

// create a client instance
$client = new Solarium\Client($config);

// get a select query instance
$query = $client->createQuery($client::QUERY_SELECT);

// this executes the query and returns the result
$resultset = $client->execute($query);

// display the total number of documents found by solr
//echo 'NumFound: '.$resultset->getNumFound();
$i = 0;
// show documents using the resultset iterator
foreach ($resultset as $document) {
      
    //echo '<hr/><table>';

    // the documents are also iterable, to get all fields
    foreach ($document as $field => $value) {
        // this converts multivalue fields to a comma-separated string
        //$j=0;
        if (is_array($value)) {
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
    //echo '</table>';
       
}
$values['status']='True';
$values['list'] = $tweets;
$values['msg'] = 'success';
$result = json_encode($values);
print_r($result);
//htmlFooter();
