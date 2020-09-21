function map (num, in_min, in_max, out_min, out_max) {
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function polydraw(){
  var pointsarr = [];
  var points = "0 1000";
  var counter = 2.01;
  var crcls = "";
  for( i = 0; i < Data_Store.split_text.length; i++){
    pointsarr[i] = Data_Store.split_text[i][6][2];
    //console.log(Data_Store.split_text[i][6][2]);
  //   if (Data_Store.split_text[i][7]){
  //   points += ","+(counter*20).toString()+" "+(Data_Store.split_text[i][7]/100000+1000).toString();

    x = ((Data_Store.split_text[i][2].get("X")-Data_Store.first_date.get("X"))/20000000)+100;
    y = (Data_Store.split_text[i][2].get("hour")*60+Data_Store.split_text[i][2].get("minute")*60)/10+100/*(500+map(Data_Store.split_text[i][6][2],-5,5,100,0)).toString()*/;
     // console.log(x);
     // console.log(y);
     try{
    crcls += "<circle cx='"+x+"' cy='"+y+"' r='"+/*(Data_Store.split_text[i][4].length/10).toString()*/6+"' stroke-width='0' fill='hsla("+map(Data_Store.split_text[i][6][2],-5,5,0,150)+",100%,50%,0.05)'/>"
} catch{};
     if(Data_Store.split_text[i][7]){
     try{
     crcls += "<text x='"+x+"' y='"+y+"' fill='black' font-size='6'>"+nlp(Data_Store.split_text[i][4]).topics().out('array')/*Data_Store.split_text[i][8]*//*[0]['main']*/+"</text>";
   } catch(err) {

     crcls += "<text x='"+x+"' y='"+y+"' fill='black' font-size='6'>"+err.message/*[0]['main']*/+"</text>";

   };
    counter += 0.05;
};

}
//console.log(crcls);
  document.body.innerHTML = "<svg height='19000' width='19000'>"+crcls+/*<polyline points='"+points+"' style='fill:none;stroke:black;stroke-width:1' />*/"</svg>";
};

  //<circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />
