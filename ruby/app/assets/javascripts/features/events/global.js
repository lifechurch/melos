function clearText(field){if(field.defaultValue==field.value)field.value='';else if(field.value=='')field.value=field.defaultValue;}$(document).ready(function(){$('.MobileDropdown').hide();$('.mobile-menu-btn').click(function(){$('.MobileDropdown').slideDown(300);});$('.close-dropdown-btn-mobile').click(function(){$('.MobileDropdown').slideUp(300);});});



