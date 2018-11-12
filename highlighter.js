function main() {
    let structuredHackerNewsList = getStructuredHackerNewsList();

    rankHackerNewsPosts(structuredHackerNewsList);

    console.log(structuredHackerNewsList.length)
}

function getStructuredHackerNewsList() {
    const titleClass = 'athing';
    const regexOfScore = '^([0-9]*)( )(points)$';
    const regexOfComments = '^([0-9]*)(&nbsp;)(comments)$';

    let hackerNewsItemList = [...document.querySelectorAll('.itemlist tbody tr')];
    return hackerNewsItemList
        .filter(function (item) {
            return item.classList.contains(titleClass);
        }).map(function (item, key) {
            let scoreDom = item.nextSibling.querySelectorAll('.score')[0];
            let score = 0;
            if (scoreDom !== undefined) {
                score = scoreDom.innerHTML.match(regexOfScore)[1];
            }

            let allLinkDom = item.nextSibling.querySelectorAll('a');
            let commentsDom = allLinkDom[allLinkDom.length - 1];
            let numberOfComments = 0;
            let parsedResultOfComments = commentsDom.innerHTML.match(regexOfComments);
            if (parsedResultOfComments !== null) {
                numberOfComments = parsedResultOfComments[1];
            }

            return {
                'title': item,
                'metaData': item.nextSibling,
                'blankLine': item.nextSibling.nextSibling,
                'score': parseInt(score),
                'numberOfComments': parseInt(numberOfComments),
                'sumOfScoreAndComments': parseInt(score) + parseInt(numberOfComments)
            };
        }).sort(function (previous, current) {
            return previous.sumOfScoreAndComments - current.sumOfScoreAndComments;
        });
}

function isOdd(number) {
    return (number % 2 === 1);
}

function getMedian(collection) {
    let listLength = collection.length;

    if (isOdd(listLength)) {
        let evenMedianIndex = Math.ceil(listLength / 2) - 1;
        return collection[evenMedianIndex].sumOfScoreAndComments;
    }

    let evenMedianIndexA = (listLength / 2) - 1;
    let evenMedianIndexB = evenMedianIndexA + 1;

    return (collection[evenMedianIndexA].sumOfScoreAndComments +
        collection[evenMedianIndexB].sumOfScoreAndComments) / 2;
}

function getAverage(collection) {
    let sum = collection.reduce(function (sum, item) {
        return sum + item.sumOfScoreAndComments;
    }, 0);

    return sum / collection.length;
}

function getStandardDevilation(collection, average) {
    let squareDiffSum = collection.reduce(function (sum, item) {
        let diff = item.sumOfScoreAndComments - average;
        return sum + Math.pow(diff, 2);
    }, 0);

    return Math.sqrt(squareDiffSum / collection.length);
}

function rankHackerNewsPosts(structuredHackerNewsList) {

    let median = getMedian(structuredHackerNewsList);
    let average = getAverage(structuredHackerNewsList);
    let standardDevilation = getStandardDevilation(structuredHackerNewsList, average);
}

function addRankClass(item, score, numberOfComments) {
    const tierOne = 400;
    const tierTwo = 300;
    const tierThree = 100;
    const tierFour = 0;
    const scoreWeight = 0.7;
    const commentWeight = 1.15;

    let result = (score * scoreWeight) + (numberOfComments * commentWeight);
    let color = '#FFFFFF';

    if (result >= tierOne) {
        color = '#fc192f';
    } else if (result < tierOne && result >= tierTwo) {
        color = '#e2890b';
    } else if (result < tierTwo && result >= tierThree) {
        color = '#28a745';
    } else if (result < tierThree && result >= tierFour) {
        color = '#6c757d';
    } else {
        console.log('???');
    }

    changeColor(item, color);
    return item;
}

function changeColor(item, color) {
    return item.querySelector('.storylink').style.color = color;
}

main();