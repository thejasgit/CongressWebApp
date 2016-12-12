<?php 

$verb = $_SERVER['REQUEST_METHOD'];

$apikey = 'apikey=91ab9c55bc1b46e08dd7860add802edf';
$endpoint = 'https://congress.api.sunlightfoundation.com/';

if($verb == 'GET'){
    
    if(isset($_GET['query'])){
        
        if($_GET['query']=="legislator"){
        
       //  $legislators = get_legislators();
       // $response_array = array('response'=>$legislators);
        $response_array = get_legislators();
            
    }else if($_GET['query']=="committee"){
        
       // $committees = get_committees();
        // $response_array = array('response'=>$committees );
      $response_array = get_committees();
            
    }else if($_GET['query']=="bills"){
        
           // $bills = get_bills();
       // $response_array = array('response'=>$bills);
            $response_array = get_bills();
    }else{
        
        $response_array = "{'error':'query parameter is invalid in the url'}";
    }
  
    }else {
         $response_array = "{'error':'query parameter is invalid in the url'}";
    }
    
    
   // var_dump($legislators);
    header('Content-Type: application/json');
    //echo json_encode($response_array);
    echo $response_array;

    
    
}
else{
    
    echo "<h3>Not Found</h3>";
    
    
}



function get_legislators(){
    
    $url = $GLOBALS['endpoint'] . 'legislators?' . $GLOBALS['apikey'] . '&per_page=all' ;
    return invoke_sunlight_api($url); 
    
}

function get_bills(){
    
      $url = $GLOBALS['endpoint'] . 'bills?' . $GLOBALS['apikey'] . '&per_page=50' ;
    if(isset($_GET['sponsor_id'])){
       $url.='&sponsor_id=' .  trim($_GET['sponsor_id']) ; 
        return invoke_sunlight_api($url);
    } else{
        
        $active_url = $GLOBALS['endpoint'] . 'bills?history.active=true&' . $GLOBALS['apikey'] . '&per_page=50' ;
    $inactive_url = $GLOBALS['endpoint'] . 'bills?history.active=false&' . $GLOBALS['apikey'] . '&per_page=50' ;
       $active = json_decode(invoke_sunlight_api($active_url),true);
        $inactive = json_decode(invoke_sunlight_api($inactive_url),true);
        $res_merge = array_merge($active['results'],$inactive['results']);
        $response_array = array('results'=>$res_merge);
        return json_encode($response_array);
            
    }
   
}

function get_committees(){
    
     $url = $GLOBALS['endpoint'] . 'committees?' . $GLOBALS['apikey'] . '&per_page=all' ;
    if(isset($_GET['member_ids'])){
      $url.='&member_ids=' .  trim($_GET['member_ids']) ;
    }
   return invoke_sunlight_api($url);
}


function invoke_sunlight_api($url){
            
             $response = file_get_contents($url);
            // $response = json_decode($response,true);
             return $response;
            
        }

?>