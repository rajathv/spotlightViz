define(function() {

  var currencyMap = {};
  currencyMap["EUR"] = "\ue968";
  currencyMap["GBP"] = "\ue969";
  currencyMap["GEL"] = "\ue96a";
  currencyMap["SEK"] = "\ue96b";
  currencyMap["USD"] = "\ue96c";

  var localeVal = window.navigator.userLanguage || window.navigator.language; 

  var currencySymbolToUse = function() {
    return kony.mvc.MDAApplication.getSharedInstance().appContext.CURRENCY_SYMBOL_TO_USE;
  };
  var defaultCurrencyCode = function(code) {
    var baseCurrency = kony.mvc.MDAApplication.getSharedInstance().appContext.BASE_CURRENCY != undefined ? 
        kony.mvc.MDAApplication.getSharedInstance().appContext.BASE_CURRENCY : "USD";
    return currencySymbolToUse() === "BASE_CURRENCY" ? currencyMap[baseCurrency] : (code ? currencyMap[code] : currencyMap[baseCurrency]);
  };
  // currencySymbolToUse = BASE_CURRENCY or BACKEND_CURRENCY

  var formatCurrencyWithCode = function(str, code) {
    var currencyCode = defaultCurrencyCode(code);
    if (str) {
      return currencyCode + " " + Number(str).toLocaleString();
    }
    return currencyCode + " " + "0";
  };
  
  var formatCurrencyInDetail = function(str, code) {
    var amount = isNaN(str) ? "0.00" : Number(str).toFixed(2);
    if (Number(amount) < 0) {
      return "(" + formatCurrencyWithCode(Math.abs(amount), code) + ")";
    }
    return formatCurrencyWithCode(amount, code);
  };
  
  var formatCurrency = function(str, code) {
    return formatCurrencyInDetail(str, code);
  };

  var formatCurrencyWithSuffix = function(str, suffix) {
    if (str) {
      return str + " " + suffix;
    }
    return "0" + " " + suffix;
  };

  var formatCurrencyByDeletingSign = function(str) {
    return str.substring(0,1) === "-" ? str.substring(1) : str;
  };

  var getCurrencyFormat=function(number) {
    return number.toLocaleString(localeVal); 
  };

  return {
    defaultCurrencyCode: defaultCurrencyCode,
    formatCurrency: formatCurrency,
    formatCurrencyWithCode: formatCurrencyWithCode,
    formatCurrencyWithSuffix: formatCurrencyWithSuffix,
    formatCurrencyByDeletingSign: formatCurrencyByDeletingSign,
    getCurrencyFormat:getCurrencyFormat
  };
});
