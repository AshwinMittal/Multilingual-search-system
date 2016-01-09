This Multilingual Search System highlights the following main components: 
Content Tagging, Faceted Search, Cross Document Analysis and Multilingual Search. 

The data set consists of English, German, French, Russian tweets based on the most recent topics as well as some general topics. 
The user interface is based on AngularJS. The user interface is integrated with Solr through the PHP Solarium Library. 

-The data is indexed using Apache Solr.
-The search system accepts an input query, passes the query through Yandex API for multilingual translation and accordingly displays all the related tweets in the results. 
-Each result has its hashtags listed which lead to tweets with similar hashtags. The results also display the username and the date on which the tweet was posted.
-The user interface also displays a sentiment analysis, categorizing the sentiments as positive, negative or neutral. 
-Faceting is implemented on the fields of language, hashtags, users, location. Each facet narrows down the results to tweets related to that particular query and the faceted entity. 
-Cross Document, analysis has been implemented using the Alchemy API leading to Sentiment Analysis and Language Pi Chart, which gives the breakdown of the tweets belonging to each language. 
-Content Tagging is also implemented using the Alchemy API. Each result displays the contents along with the hashtags. 
-Searching on the contents or the Hashtags give a new set of results related to that content or the hashtag. 