# Hacker News Title Highlighter #

For highlighting news that with more points and comments ###


### Put the following into browser bookmark

```js
javascript:function main(){let e=getStructuredHackerNewsList(),t=getBottomOfHackerNewsList();rankHackerNewsPosts(e),replaceDomWithSortedHackerNewsList(e,t)}function getSiteWeightingCoefficient(e){switch(e){case"github.com":return 60;case"newyorker.com":return 50;default:return 0}}function getStructuredHackerNewsList(){return[...document.querySelectorAll(".itemlist tbody tr")].filter(function(e){return e.classList.contains("athing")}).map(function(e,t){let n=e.nextSibling.querySelectorAll(".score")[0],i=0;void 0!==n&&(i=n.innerHTML.match("^([0-9]*)( )(points)$")[1]);let r=.8*(i=parseInt(i)),l=e.nextSibling.querySelectorAll("a"),u=0,o=l[l.length-1].innerHTML.match("^([0-9]*)(&nbsp;)(comments)$");null!==o&&(u=o[1]);let c=1.2*(u=parseInt(u)),a="";null!==e.querySelector(".sitestr")&&(a=e.querySelector(".sitestr").innerHTML);let s=getSiteWeightingCoefficient(a);return{titleDom:e,title:e.innerText,metaDataDom:e.nextSibling,blankLineDom:e.nextSibling.nextSibling,site:a,score:i,numberOfComments:u,siteWeightingCoefficient:s,sum:i+u,weightedSum:r+c+s}}).sort(function(e,t){return e.sum-t.sum})}function getBottomOfHackerNewsList(){let e=document.querySelector(".morespace");return[e,e.nextSibling]}function replaceDomWithSortedHackerNewsList(e,t){let n=document.querySelector(".itemlist tbody");n.innerHTML="",e.reverse().map(function(e){n.appendChild(e.titleDom),n.appendChild(e.metaDataDom),n.appendChild(e.blankLineDom)}),t.map(function(e){n.appendChild(e)})}function isOdd(e){return e%2==1}function getAverage(e){return e.reduce(function(e,t){return e+t.sum},0)/e.length}function getVariance(e,t){return e.reduce(function(e,n){let i=n.sum-t;return e+Math.pow(i,2)},0)}function getStandardDevilation(e,t){return Math.sqrt(t/e.length)}function getMedian(e){let t=e.length;if(isOdd(t)){let n=Math.ceil(t/2)-1;result=e[n].sum}else{let n=t/2-1,i=n+1;result=(e[n].sum+e[i].sum)/2}return result}function getQuartiles(e){let t=e.length,n=e.slice(),i=Math.round(t/2),r=n.splice(0,i),l=n;return{lower:getMedian(r),median:getMedian(e),upper:getMedian(l)}}function rankHackerNewsPosts(e){let t=200,n=getQuartiles(e),i=(getStandardDevilation(e,getVariance(e,getAverage(e))),n.upper-t);return i<0&&Math.abs(i/t)>.25&&(t*=.68),e.map(function(e){e.weightedSum>400?e.titleDom.querySelector(".titlelink").style.color="#f70441":e.weightedSum>t&&(e.titleDom.querySelector(".titlelink").style.color="#28a745")})}main();
```

Click the bookmark or execute the js script in the console.

![image](https://user-images.githubusercontent.com/11385444/138650609-bd295d3c-2967-4da3-9923-7d659e7c4917.png)

You can customize your own weight score in https://github.com/MAJA-Lin/HackerNewsHightlighter/blob/master/highlighter.js#L9-L23

