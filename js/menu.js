
// reference to last opened menu
var $lastOpened = false;

  
// simply close the last opened menu on document click
$(document).click(function(){
  if($lastOpened){
    $lastOpened.removeClass('open');
  }
});


// simple event delegation
$(document).on('click', '.pulldown-toggle', function(event){
  
  // jquery wrap the el
  var el = $(event.currentTarget);
  
  // prevent this from propagating up
  event.preventDefault();
  event.stopPropagation();

  // check for open state
  if(el.hasClass('open')){
    el.removeClass('open');
  }else{
    if($lastOpened){
      $lastOpened.removeClass('open');
    }
    el.addClass('open');
    $lastOpened = el;
  }
  
});