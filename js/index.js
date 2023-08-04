const api_url_sw = "https://www.swapi.tech/api/"
// Need a hint? try people/1/ or planets/3/ or starships/9/

const api_url_coffee = "https://sampleapis.com/api-list/coffee/"
// /hot or /iced

// helper function that makes a complete endpoint
const sw_url = function ( api, endpoint ) {
    return `${api}${endpoint}`
}

async function getapi ( url ) {

    if ( typeof ( url ) !== 'string' ) console.error( 'invalid url' )

    const response = await fetch ( url )

    const data = await response.json()
    console.log ( data )
    
    if ( response ) {
        hideloader()
    }

    // === MAKE A SWITCH in the end. no need to duplicate code
    show ( data, 'name' )
}

const characters = sw_url ( api_url_sw, 'people' )
getapi( characters );

const show = function ( list, key ) {
    
    // create a list of bulletpoints to use them in dropdown menu
    
    // create a dropdown menu
    const formWrapper = document.getElementById( 'form-wrapper' )
    const form = document.createElement('form')
    formWrapper.appendChild(form)
    const select = document.createElement('select')
    form.appendChild(select)

    // populate the menu
    const makeOptions = function ( ) {
        list.results
        .reduce( ( memo, obj ) => memo.concat( obj[ key ] ) , [] )
        .forEach( el => {
            const option = document.createElement('option')
            option.text = el
            select.append(option)
        })
    }
    makeOptions()
}

function hideloader () {
    document.getElementById( 'loading' ).style.display = 'none'
}
