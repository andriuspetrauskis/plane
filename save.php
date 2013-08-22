<?php
if ($_POST){
	$data = json_decode(file_get_contents('scores'), true);
	$data[] = $_POST;
	file_put_contents('scores', json_encode($data));
}
 ?>