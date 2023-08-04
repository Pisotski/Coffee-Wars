const api_url_sw = "https://www.swapi.tech/api/"

const api_url_coffee = "https://sampleapis.com/api-list/coffee/"
// /hot or /iced

// helper function that makes a complete endpoint
const sw_url = function ( api, endpoint ) {
    return `${api}${endpoint}`
}

async function getapi ( url ) {

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

function hideloader () {
    document.getElementById( 'loading' ).style.display = 'none'
}

const characters = sw_url ( api_url_sw, 'people' )

const show = function ( data, key1, key2 ) {
    // error handling if no data received
    if ( !data ) { return }

    // create a list of bulletpoints to use them in dropdown menu
    const getValue = function ( e ) {
        e.preventDefault()
        console.log( e.target.value )
    }
    // create a dropdown menu
    const formWrapper = document.getElementById('form-wrapper')
    const form = document.createElement('form')
    formWrapper.appendChild(form)
    const select = document.createElement('select')
    select.addEventListener('change', getValue)
    form.appendChild(select)

    // populate the menu
    // flatten the array. make tuples [name and url]
    // assign attributes name and url for each option
    const makeOptions = function ( ) {
    data.results
        .reduce( (memo, obj) => memo.concat([[obj[key1], obj[key2]]]), [])
        .forEach( (el, i, list) => {
            const option = document.createElement('option')
            const charName = el[0]
            const charURL = el[1]
            option.text = charName
            option.setAttribute('id', charName)
            option.setAttribute('url', charURL)
            select.append(option)
        })
    }
    makeOptions()
}

const showDropDown = getapi( characters ).then( ( data ) => show ( data, 'name', 'url' ) );
