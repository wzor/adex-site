
window.changeLanguage = language => {
	let newURL = window.location.pathname + '?language=' + language
    
    console.log(newURL)
	$.get(newURL).then(response => {
		document.open()
		document.write(response)
		document.close()
	})
}