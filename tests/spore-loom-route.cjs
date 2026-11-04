module.exports=level=>[[7,11,12],[12,13],[10,11,12]][level].map(i=>'cell-'+i).concat(Array([3,3,4][level]).fill('grow'));
