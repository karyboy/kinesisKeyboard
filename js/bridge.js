
// bridging the cursor of kinesis with the events of the document 



(function(){
    var _;
    
    window.bridge=function(){}   // create a new object bridge in window scope
    
    window.kinesis=new Kinesis;  // create a new object kinesis in window scope
    
    bridge.ass=function(){
        return _=this;
    };
    
    bridge.cursorposition=null;  // current kinesis cursor position
    
    bridge.current=null;         // current button 
    
    bridge.prev=null;            // previous button 
    
    bridge.tim=null;             // holds the timeout variable
    
    bridge.holdtime=null;        // cursor hold time over a character before input
    
    bridge.opts=null;            // object containing options 
    
    
    // set hold time of cursor 
    
    
    bridge.setHoldTime=function(){
        _.holdtime=(typeof _.opts.holdtime==="number") ? _.opts.holdtime : 1000;
        return _;
    }
    
    
    // set options 
    
    
    bridge.setOpts=function(opts){
        this.opts=opts;
    }
    
    
    // called each time position of the kinesis cursor changes
    
    
    bridge.check=function(position){
        var __;
        var chk=this;
        chk.curpos={
            x:0,
            y:0
        };
        chk.ass=function(){
            return __=this;
        };
        chk.setCursorPosition=function(){
            __.curpos.x=position.x;
            __.curpos.y=position.y;
            return __;
        }
       
        chk.firing=function(){
            if(typeof __.curpos.x==="number"){
                _.prev=(typeof _.current==="object")? _.current : null;
                _.current=document.elementFromPoint(__.curpos.x, __.curpos.y);
                //  console.clear();
                //  console.log(_.current);
                if(_.prev !==null )
                    _.fireClear();
                _.fireOver();
                return true;
            }
            else{
                _.fireClear();
                return false
            //  console.log("NOT IN");
            }      
                 
        }
        
        chk.start=function(){
            this.ass().setCursorPosition().firing();
        }
       
        chk.start();
        return _;
    }
    
   
    
    // simulate an event 
    
    
    bridge.dispatcheEvent=function(element,opts,callback){
        //console.log(element);
        var typeEvent= typeof opts.typeEvent === "string" ? opts.typeEvent : "mousedown" ; 
        var doc=element;
        var eve=document.createEvent("MouseEvents");
        var sx=0,sy=0,cx=0,cy=0;
        eve.initMouseEvent(typeEvent,true,true,window,0,sx,sy,cx,cy,false,false,false,false,0,null);
        var val=doc.dispatchEvent(eve);
        if(typeof callback==="function" )
            callback();
      
    }
    
    
    // simulates mouseout event 
    
    
    bridge.fireClear=function(){ 
        _.dispatcheEvent(_.prev,{
            typeEvent:"mouseout"
        });
        clearTimeout(_.tim);
    }
    
    // simulates click event 
    
    
    bridge.fireClic=function(){
        console.log("firing click");
        _.dispatcheEvent(_.current,{
            typeEvent:"click"
        });
    }
    
    
    // simulates  mouseover event 
    
    
    bridge.fireOver=function(){ 
        _.dispatcheEvent(_.current,{
            typeEvent:"mouseover"
        });
        _.tim=setTimeout(function(){
            _.fireClic();
            _.fireClear();
            _.fire(_.cursorposition);
        },_.holdtime);
    }
    
    
    // fire is called each time the position of the kinesis cursor changes 
    
    
    bridge.fire=function(position){
        _.cursorposition=position;
        _.check(position);
    }
    
    
    // initialize kinesis
    
    
    
    bridge.initKinesis=function(){ 
        Kinesis.cursor = _.fire;
    //var sg= new SwipeGestureListener("kary1listener");
    // sg.toFire=b;
    // sg.directions=[GestureDirections.GestureDirectionLeft];
    // kinesis.addGesture(sg);
    }
    
    
    // start the bridging 
    
    
    bridge.start=function(){ 
        this.ass().setHoldTime().initKinesis();
    }
    
    
   
    
})();

