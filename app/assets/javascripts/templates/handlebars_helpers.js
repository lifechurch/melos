Handlebars.registerHelper('lookup', function(obj, field) {
  return obj[field];
});
Handlebars.registerHelper('fromNow', function(context, block) {
  if (window.moment) {
    return moment(context).fromNow();
  }else{
    return context;   //  moment plugin not available. return data as is.
  };
});
Handlebars.registerHelper('I18n',
  function(str){
    return (I18n != undefined ? I18n.t(str) : str);
  }
);
Handlebars.registerHelper('stringify',
  function(json){
    return JSON.stringify(json);
});
