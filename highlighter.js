function main() {
    const titleClass = 'athing';
    const regexOfScore = '^([0-9]*)( )(points)$';
    const regexOfComments = '^([0-9]*)(&nbsp;)(comments)$';
    let hackerNewsItemList = document.querySelectorAll('.itemlist tbody tr');

    hackerNewsItemList.forEach(function (item, key) {
        if (item.classList.contains(titleClass)) {
            let scoreDom = item.nextSibling.querySelectorAll('.score')[0];
            if (scoreDom == undefined) {
                return false;
            }
            let score = scoreDom.innerHTML.match(regexOfScore)[1];

            let allLinkDom = item.nextSibling.querySelectorAll('a');
            let commentsDom = allLinkDom[allLinkDom.length - 1];
            let numberOfComments = 0;
            let parsedResultOfComments = commentsDom.innerHTML.match(regexOfComments);
            if (parsedResultOfComments !== null) {
                numberOfComments = parsedResultOfComments[1];
            }

            addRankClass(item, score, numberOfComments);
        }
    });

    return true;
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