(function() {
    $.ajax({
        url: "http://bg.test.download.infragistics.local/products/infragistics/IgniteUI/test.json",
        type: "get",
        xhrFields: {
            withCredentials: false
        }
    }).done((data) =>  {
        const folders = data.folders;
        const select = $('#versions')

        folders.forEach(f => {
            select.append($('<option>', {
                value: f,
                text: f
            }));
        });

        if (sessionStorage.apiVersion) {
            select.val(sessionStorage.apiVersion);
        }
    });

    $('#versions').on('change', (...rest) => {
        const val = $('#versions').val();
        sessionStorage.apiVersion = val;
    })
})();