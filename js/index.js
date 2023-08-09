const api_url_sw = "https://www.swapi.tech/api/"

const api_url_coffee = "https://sampleapis.com/api-list/coffee/"
// /hot or /iced

// helper function that makes a complete endpoint
const sw_url = function ( api, endpoint ) {
    return `${api}${endpoint}`
}

async function getapi (url) {

    if ( typeof ( url ) !== 'string' ) console.error( 'invalid url' )

    try {

        const response = await fetch ( url )
        
        const data = await response.json()
        console.log ( 'data received' )

        if ( response ) {
            hideloader()
        }

        return data ? data : response

    } catch ( err ) {
        console.error(`FAILED TO FETCH ${ err }`)
    }

}

// =====>>>> remake hide module
function hideloader () {
    document.getElementById( 'loading' ).style.display = 'none'
}

const characters = sw_url ( api_url_sw, 'people' )

const createDropdown = function ( data, key1, key2 ) {
    // error handling if no data received
    if ( !data ) { return }

    // create a list of bulletpoints to use them in dropdown menu
    // create a dropdown menu
    const formWrapper = document.getElementById('form-wrapper')
    const form = document.createElement('form')
    const select = document.createElement('select')
    select.addEventListener('change', handleDropdownSelect)
    form.appendChild(select)

    // populate the menu
    // flatten the array. make tuples [name and url]
    // assign attributes name and url for each option
    const createOptions = function ( ) {
    data.results
        .reduce( (memo, obj) => memo.concat([[obj[key1], obj[key2]]]), [])
        .forEach( (el, i, list) => {
            const option = document.createElement('option')
            const charName = el[0]
            const charURL = el[1]
            option.setAttribute('label', charName)
            option.setAttribute('url', charURL)
            select.append(option)
        })
        const defaultOption = document.createElement('option')
        defaultOption.setAttribute('value', 'none')
        defaultOption.setAttribute('label', 'Select a Character')
        defaultOption.setAttribute('class', 'default-option')
        defaultOption.selected = true
        defaultOption.disabled = true
        defaultOption.hidden = true
        select.append(defaultOption)
    }
    createOptions()

    show ( formWrapper, form )
}

const removeKeys = function (obj, keys) {
    // both arguments must be objects
    const cleanObj = {}
    for(let key in obj) {
        if(!keys[key]) {
            cleanObj[key] = obj[key]
        }
    }
    return cleanObj
}

const createPlanet = function (planet) {

    const unwantedKeys = {
        "created": 1,
        "edited": 1,
        "name": 1,
        "url": 1
    }
    const planetName = planet.result.properties.name
    const planetClean = removeKeys(planet.result.properties, unwantedKeys)
    const planetList = createList(planetName, planetClean)
    planetList.style.display = 'none'

    return planetList
}

let currentPlanet;
let isCurrentPlanetDisplayed = false;

const createList = function(name, listItems) {
    // name = string
    // listItems = object
    const list = document.createElement('ul')
    list.innerText = name

    const createLi = function (leftLi, rightLi, nameLi) {
        
        const propertiesLi = document.createElement('li')
        propertiesLi.setAttribute('id', `${spacesToDashes(nameLi)}-${spacesToDashes(leftLi)}`)
        
        if (rightLi instanceof Element) {
            propertiesLi.innerText = `${leftLi} : `
            propertiesLi.appendChild(rightLi)
        } else if (typeof rightLi === 'string') {
            propertiesLi.innerText = `${leftLi} : ${rightLi}`
        }
        return propertiesLi
    }

    for (let prop in listItems) {

        if(listItems[prop] !== 'n/a') {
            if(prop === 'homeworld') {
                getapi(listItems[prop])
                .then(planet => {
                    currentPlanet = createPlanet(planet)
                    const planetName = planet.result.properties.name
                    const spanPlanet = document.createElement('span')
                    spanPlanet.textContent = planetName
                    spanPlanet.addEventListener('click', handlePlanetClick)
                    spanPlanet.setAttribute('class', 'planet')
                    const li = createLi('homeworld', spanPlanet, planetName)
                    list.appendChild(li)
                    li.append(currentPlanet)
                })
            } else {
                const li = createLi(prop, listItems[prop], name);
                list.appendChild(li)  
            }
        }
    }
    return list
}

const createBio = function ( bio ) {

    // <div id="bio-wrapper">
    //    <ul id="${name}-bio-ul" label="name">
    //      <li id="${name}-${key}-li" class="${name}-bio-li">...</li></ul></div>

    const bioProperties = bio.result.properties
    const heroName = bioProperties.name
    const unwantedKeys = {
        'name': 1,
        'created': 1,
        'edited': 1,
        'url': 1
    }
    const bioClean = removeKeys(bioProperties, unwantedKeys)
    const bioWrapper = document.createElement('div')
    bioWrapper.setAttribute('id', `${spacesToDashes(heroName)}-bio-wrapper`)
    const bioList = createList(heroName, bioClean)
    bioWrapper.appendChild(bioList)

    return bioWrapper
}

const show = function ( parent, module ) {

    // function removeAllChildNodes(parent) {
    //     while (parent.firstChild) {
    //         parent.removeChild(parent.firstChild);
    //     }
    // }
    // removeAllChildNodes(parent)

    parent.appendChild(module)
    return
}

const spacesToDashes = function ( string ) {
    if (typeof(string) !== 'string' && !string ) {
        console.error('Must be a string')
        return 
    }
    // helper function to make 
    // all letters to lowercase and 
    // to swap spaces with dashes for better navigation and consistency
    string = string.toLowerCase()
    return `${string.split(' ').join('-')}`
}

// on click get information and display it
const handleDropdownSelect = function ( e ) {
    e.preventDefault()
    const optionNum = e.target.selectedIndex
    const optionUrl = e.target[optionNum].getAttribute('url')
    const mainWrapper = document.getElementById('main-wrapper')
    getapi(optionUrl)
    .then(data => show(mainWrapper, createBio(data)))
}

const handlePlanetClick = function (e) {
    e.preventDefault()
    if(!isCurrentPlanetDisplayed) {
        currentPlanet.style.display = 'block'
    } else {
        currentPlanet.style.display = 'none'
    }
    isCurrentPlanetDisplayed = !isCurrentPlanetDisplayed
}

const showDropDown = getapi(characters)
    .then(data => createDropdown(data,'name','url'))
