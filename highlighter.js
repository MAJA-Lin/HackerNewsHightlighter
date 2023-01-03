function main() {
    let structuredHackerNewsList = getStructuredHackerNewsList();
    let contentBottom = getBottomOfHackerNewsList()

    rankHackerNewsPosts(structuredHackerNewsList);
    replaceDomWithSortedHackerNewsList(structuredHackerNewsList, contentBottom);
}

function getSiteWeightingCoefficient(site) {
    switch (site) {
        case 'github.com':
            return 60;
            break;

        case 'newyorker.com':
            return 50;
            break;

        default:
            return 0;
            break;
    }
}

function getStructuredHackerNewsList() {
    const mainQuery = '#hnmain > tbody > tr:nth-child(3) > td > table > tbody > tr'
    const newsClass = 'athing';
    const titleClass = 'span.titleline > a';
    const siteClass = 'sitestr';
    const regexOfScore = '^([0-9]*)( )(points)$';
    const regexOfComments = '^([0-9]*)(&nbsp;)(comments)$';

    let hackerNewsItemList = [...document.querySelectorAll(mainQuery)];
    return hackerNewsItemList
        .filter(function (item) {
            return item.classList.contains(newsClass);
        }).map(function (item, key) {
            // Get score
            let scoreDom = item.nextSibling.querySelectorAll('.score')[0];
            let score = 0;
            if (scoreDom !== undefined) {
                score = scoreDom.innerHTML.match(regexOfScore)[1];
            }
            score = parseInt(score);
            let weightedScore = score * 0.8;

            // Get comments
            let allLinkDom = item.nextSibling.querySelectorAll('a');
            let commentsDom = allLinkDom[allLinkDom.length - 1];
            let numberOfComments = 0;
            let parsedResultOfComments = commentsDom.innerHTML.match(regexOfComments);
            if (parsedResultOfComments !== null) {
                numberOfComments = parsedResultOfComments[1];
            }
            numberOfComments = parseInt(numberOfComments);
            let weightedNumberOfComments = numberOfComments * 1.2;

            // Get original site
            let site = '';
            if (item.querySelector('.sitestr') !== null) {
                site = item.querySelector('.sitestr').innerHTML;
            }
            let siteWeightingCoefficient = getSiteWeightingCoefficient(site);

            let title = '';
            if (item.querySelector(titleClass) !== null) {
              title = item.querySelector(titleClass).innerHTML;
            }


            return {
                'titleDom': item,
                'title': title,
                'metaDataDom': item.nextSibling,
                'blankLineDom': item.nextSibling.nextSibling,
                'site': site,
                'score': score,
                'numberOfComments': numberOfComments,
                'siteWeightingCoefficient': siteWeightingCoefficient,
                'sum': score + numberOfComments,
                'weightedSum': weightedScore + weightedNumberOfComments + siteWeightingCoefficient
            };
        }).sort(function (previous, current) {
            // From small to big
            return previous.sum - current.sum;
        });
}

function getBottomOfHackerNewsList() {
    let spaceDom = document.querySelector('.morespace');
    let bottomTr = spaceDom.nextSibling;

    return [spaceDom, bottomTr];
}

function replaceDomWithSortedHackerNewsList(collection, contentBottom) {
    let newsListDom = document.querySelector('.itemlist tbody');

    // Erase everything
    newsListDom.innerHTML = '';

    // Replace with sorted list
    collection.reverse().map(function (item) {
        newsListDom.appendChild(item.titleDom);
        newsListDom.appendChild(item.metaDataDom);
        newsListDom.appendChild(item.blankLineDom);
    });

    contentBottom.map(function (item) {
        newsListDom.appendChild(item);
    });
}

function isOdd(number) {
    return (number % 2 === 1);
}

function getAverage(collection) {
    let sum = collection.reduce(function (sum, item) {
        return sum + item.sum;
    }, 0);

    return sum / collection.length;
}

function getVariance(collection, average) {
    let variance = collection.reduce(function (sum, item) {
        let diff = item.sum - average;
        return sum + Math.pow(diff, 2);
    }, 0);

    return variance;
}

function getStandardDevilation(collection, variance) {
    return Math.sqrt(variance / collection.length);
}

function getMedian(collection) {
    let length = collection.length;

    if (isOdd(length)) {
        let oddMedianIndex = Math.ceil(length / 2) - 1;
        result = collection[oddMedianIndex].sum;
    } else {
        let evenIndexA = (length / 2) - 1;
        let evenIndexB = evenIndexA + 1;

        result = (collection[evenIndexA].sum + collection[evenIndexB].sum) / 2;
    }

    return result;
}

function getQuartiles(collection) {
    let length = collection.length;
    let cloneCollection = collection.slice();
    let medianIndex = Math.round(length / 2);
    let lowerHalfCollection = cloneCollection.splice(0, medianIndex);
    let upperHalfCollection = cloneCollection

    return {
        'lower': getMedian(lowerHalfCollection),
        'median': getMedian(collection),
        'upper': getMedian(upperHalfCollection),
    }
}

function rankHackerNewsPosts(collection) {

    let tierOneThreshold = 400;
    let tierTwoThreshold = 200;

    let quartiles = getQuartiles(collection);
    let average = getAverage(collection);
    let variance = getVariance(collection, average);
    let standardDevilation = getStandardDevilation(collection, variance);

    let diffOfUpperQuartileAndTierTwoThreshold = quartiles.upper - tierTwoThreshold;

    if (diffOfUpperQuartileAndTierTwoThreshold < 0) {
        if (Math.abs(diffOfUpperQuartileAndTierTwoThreshold / tierTwoThreshold) > 0.25) {
            tierTwoThreshold = tierTwoThreshold * 0.68;
        }
    }

    return collection.map(function (item) {
        const tierOneColor = '#f70441';
        const tierTwoColor = '#28a745';

        if (item.weightedSum > tierOneThreshold) {
            item.titleDom.querySelector('.rank').style.color = tierOneColor;
            item.titleDom.querySelector('.titleline>a').style.color = tierOneColor;
        } else if (item.weightedSum > tierTwoThreshold) {
            item.titleDom.querySelector('.rank').style.color = tierTwoColor;
            item.titleDom.querySelector('.titleline>a').style.color = tierTwoColor;
        }
    });
}

main();
