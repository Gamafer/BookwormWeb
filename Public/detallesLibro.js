//Al cargar la pagina se hace la peticion a bd para mostrar detalles del libro
window.onload = async function() {

    var getParams = function (url) {
        var params = {};
        var parser = document.createElement('a');
        parser.href = url;
        var query = parser.search.substring(1);
        var vars = query.split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            params[pair[0]] = decodeURIComponent(pair[1]);
        }
        return params;
    };

    let parametros = getParams(window.location.href);

    let id = parametros.id;

    try {
        const res = await fetch('/APIDetalles/'+id)
        const data = await res.json()
        if (data.error !== false) {
            console.log(data);
            document.myForm.Nombre.value = data[0].titulo;
            document.myForm.Autor.value = data[0].autor;
            document.myForm.Anio.value = data[0].fecha;
            document.myForm.Gen.value = data[0].genero;
            document.myForm.Estado.value = data[0].estado;

            let miId = document.myForm.Id;

            var newOption = document.createElement("option");
            console.log(data[0]._id);
            newOption.innerHTML = data[0]._id;
            newOption.value = data[0]._id;
            miId.options.add(newOption);
        
        }
      } catch (error) {
        console.log(error)
      }

  };