



      var modalImgs = document.querySelectorAll(".js-modal-img"),
          modalDescr = document.querySelector(".modal-descr"),
          modalImg = document.querySelector('.modalImg'),
          modalTitle = document.querySelector(".modal-title");
          for( var i=0;i<modalImgs.length;i++){
            modalImgs[i].addEventListener("click",function(){
                var request = new XMLHttpRequest(),
                    selfId = this.id;

                    request.open("GET",'images.json');
                    request.onload = function(){
                      var imgData = JSON.parse(request.responseText);
                      modalImg.src = imgData.images[selfId].url;           
                      modalDescr.innerHTML = imgData.images[selfId].description;
                      modalTitle.innerHTML = imgData.images[selfId].title;
                    }
                    request.send();

            });
          };
      

$(document).ready(function(){
          $('#myModal').on('show.bs.modal', function (e) {
            if (window.innerWidth < 768) {
               e.preventDefault();
              $('#myModal').modal('hide');
            }
          });

          $(window).resize(function(){
            if($(window).width() < 768){
              $('#myModal').modal('hide'); 
            }
          });



 
  // Add scrollspy to <body>
  $('body').scrollspy({target: ".navbar", offset: 50});   

  // Add smooth scrolling on all links inside the navbar
  $("#myNavbar a").on('click', function(event) {
    // Make sure this.hash has a value before overriding default behavior
    if (this.hash !== "") {
      // Prevent default anchor click behavior
      event.preventDefault();

      // Store hash
      var hash = this.hash;

      // Using jQuery's animate() method to add smooth page scroll
      // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 800, function(){
   
        // Add hash (#) to URL when done scrolling (default click behavior)
        window.location.hash = hash;
      });
    }  // End if
  });


  }); 

  

