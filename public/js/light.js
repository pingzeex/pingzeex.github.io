var lightPower  = '' ;
var timer ;

$(function() {
    
        var sSlider = $('#sliderRegular');
    
        var init_Slider = sSlider.attr('data-value');
    
        var Slider = document.getElementById('sliderRegular');
   
    console.log("starting");
    let analyticsObj = {};
    var gateway = new Pingzee();

    var powerLight = gateway.connectNode({
        key: "abc",
        type: "fullflow",
        app_name: "Light Control",
        multi: false,
        channels: ["yo", "test"]
    });

    function myFunction() {
        var key = prompt("Please enter node key", "Key Please");
        if (key != null && key != "") {
    
            console.log(key);
            powerLight.key = key;
            powerLight.init(function (err, status) {
    
                if (err) {
    
                    // console(err)
                } else {
                    // console(status);
                }
    
            });
    
        }
    
        else {
            myFunction();
        }
    }


    myFunction();



/*  Slider function */



noUiSlider.create(Slider, {
    start: [parseInt(init_Slider)],
    connect: [true, false],
    // padding: 10,
    // tooltips: true,
    step: 2,
    range: {
        'min': [0],
        'max': [1000]
    },

});

analyticsObj.g1 = new JustGage({
    id: "gtotal",
    value: 0,
    min: 0,
    max: 1000,
    title: " Intensity",
    label: "",
    labelFontColor: 'black',
    // symbol: '%',
    pointer: true,
    pointerOptions: {
        toplength: 6,
        // bottomlength: 0,
        // bottomwidth: 6,
        color: '#8e8e93'
    },

    humanFriendly: true,

    // levelColors: ["green"],
    donut: true,
    gaugeWidthScale: 0.1,
    counter: true,
    hideInnerShadow: true
});


    /*  Pingzee handshake */
    powerLight.on("handshake", function (data) {

        console.log("Handshake data ", data);
        if (data.success) {

            $(".statusX").html("Connected") 
            // alert("You are connected")
            console.log("Power Light is now avaliable ");

        // timer= setInterval(function () {

        //     /*  Every 1 sec get the value of slider and send it to pipe  */

        //         var value = Slider.noUiSlider.get();

        //         if (parseInt(value) === 0) {

        //             lightVal = 0

        //         } else {

        //             lightVal = (parseInt(value) / 1000).toString();
        //         }

        //         console.log(lightVal);


        //         powerLight.send(lightVal, "dimmer"); // Sending to pipe  


        //     }, 1000);

        }


        powerLight.on("error", function (data) {

            console.log(data);
            //   clearInterval(timer);
              timer= null ;
            $(".statusX").html("Offline -Reload the page")
            // alert("Reload the page , there is something wrong")


        });

        powerLight.on("yo", function (data) {


            console.log("yo channel ",data);
             Slider.noUiSlider.set(parseFloat(data));
            

            // ele.val(data.text);
            // setter(data.messages);


        });
        powerLight.on("data", function (data) {


            console.log("data channel ",data);

            // ele.val(data.text);
            // setter(data.messages);


        });
        powerLight.on("test", function (data) {


            console.log("test channel ",data);

            // ele.val(data.text);
            // setter(data.messages);


        });


    });
    
    /*  */



    $("button").click(function() {


       var cmd = $(this).data('action');

       var channel = cmd.split('-')[0]
       var action = cmd.split('-')[1]
         powerLight.send(action,channel);

        
    })

    Slider.noUiSlider.on('set', function () {
        // addClassFor(lSlide, 'tShow', 450);

            var lightVal ;
           var value = Slider.noUiSlider.get();
   
            if (parseInt(value) === 0) {
   
                lightVal = 0
                
           }
           else {
               
               lightVal =  (parseInt(value)/1000).toString() ;
            }
   
            console.log(lightVal);
            
   
        //    powerLight.send(lightVal,"dimmer","lightBox"); // Sending to p2p  
           powerLight.send(lightVal,"dimmer"); // Sending to pipe  
        //    powerLight.send(lightVal,"dimmer","test1"); // Sending value  through  
        //    powerLight.send(lightVal,"yo","dummy!"); // Sending value  through  
   
   
           analyticsObj.g1.refresh(parseInt(value))
           
        
        


    });






})()

