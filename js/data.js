var Data_Store = {
  text : "n/a", //entire text of import
  split_text : [],
  first_date : moment(),
  msgDiv : /\n(?=\d+\/\d+\/\d+,\s\d+:\d+\s[AP]M\s\-\s)/gm, //regular expression to divide messages
  msgSep : /(\d+\/\d+\/\d+), (\d+:\d+ [AP]M) - (.*?):(.*)/sum, //seperates date, time, name, message
  emojiReg : /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/gm,

  setText : function(text){
    this.text = text;
    this.divideText();
    return;
  },

  divideText : function(){
    this.split_text = this.text.split(this.msgDiv);
    for(i = 0; i<this.split_text.length; i++){
      contents = [];
      contents = this.msgSep.exec(this.split_text[i]);
      //console.log(this.split_text[i]);
      //console.log(contents);
      if(contents!=null){
        //console.log(window.ml.classify(contents[4]));
        this.split_text[i] = contents;
      }else{
        this.split_text[i] = ["","","","","","",[0,0,0]]
      };
    };
    this.dateClass();
    this.sentiClass();
    this.topicClass();
    return;
  },

  topicClass : function(){
    for(i = 0; i<this.split_text.length; i++){
      this.split_text[i][8] = nlp(this.split_text[i][4]);
    }
  },

  dateClass : function(){

    for(i = 0; i<this.split_text.length; i++){
      datev = this.split_text[i][1];
      timev = this.split_text[i][2];
      datetimev = datev + "_" + timev;
      this.split_text[i][1] = datetimev;
      this.split_text[i][2] = moment(datetimev,"MM/DD/YY_hh:mm a");
      if (i>0){
      this.split_text[i][7] = Data_Store.split_text[i][2].get("X") - Data_Store.split_text[i-1][2].get("X");
    }else {
      this.split_text[i][7] = 0;
    }
    };
    this.first_date = this.split_text[1][2]; // add time as long
  },

  sentiClass : function(){
    for( i = 0; i < this.split_text.length; i++){
      this.split_text[i][5] = this.emojiClass(this.split_text[i][4]);
      this.split_text[i][6] = [];
      this.split_text[i][6][0] = window.ml.classify(this.split_text[i][4]);
      this.split_text[i][6][1] = this.sentiMoji(this.split_text[i][5]);
      swap = this.split_text[i][6][0]+this.split_text[i][6][1];
      if(swap != 0){
        swap = swap / 2;
      };
      this.split_text[i][6][2] = swap;
    };
    this.debugThis();
    return;
  },

  sentiMoji : function(input){
    var output = 0;
    var counter = 0;
    if(input != null){
      for(n = 0; n < input.length; n++){
        if( input[n] in window.emoji ){
          output += window.emoji[input[n]];
          counter += 1;
        };
      };
      if(counter > 0){
        output = output/counter;
      };
    };
    return output;

  },

  emojiClass : function(input){
    var swap = input.match(this.emojiReg);
    return swap;
  },

  debugThis : function(){
    // document.getElementById('debug').innerHTML = '<p>' + Data_Store.text + '</p>';
    //console.log(this);
    globeinit();
    //console.log(window.pdfast.create(timesget()));
    //downloadObjectAsJson(JSON.stringify(Data_Store.split_text), "chat");
    //polydraw();
    return;
  }

};
