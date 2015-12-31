path = require('path')
remote = require('electron').remote
dialog = remote.dialog
Menu = remote.Menu

template = [
    {
        label: 'File'
        submenu: [
            {
                label: 'Open Folder'
                click: (item, focusedWindow) ->
                    theFolder = dialog.showOpenDialog {
                        properties: [ 'openDirectory' ]
                    }
                    console.log theFolder
                    diretoryTreeToObj theFolder[0], (err, res) ->
                        $('.file-tree').empty()
                        htmlStructure = ''
                        htmlStructure += '<div class="branch">'
                        htmlStructure += '<div class="label">' + path.basename(theFolder) + '</div>'
                        _.each res, (fileNode) ->
                            if fileNode.isFile
                                htmlStructure += '<div class="leaf">' + fileNode.name + '</div>'
                            else if fileNode.isFolder
                                fileNode.each(
                                    ((fileNode) ->
                                        if fileNode.isFile
                                            htmlStructure += '<div class="leaf">' + fileNode.name + '</div>'
                                        else if fileNode.isFolder
                                            htmlStructure += '<div class="branch">'
                                            htmlStructure += '<div class="label">' + fileNode.name + '</div>'
                                            console.log fileNode
                                            if fileNode.isLarge
                                                htmlStructure += '<div class="leaf">...</div>'
                                    )
                                    ((fileNode) ->
                                        htmlStructure += '</div>'
                                    )
                                )
                        htmlStructure += '</div>'
                        $('.file-tree').html(htmlStructure)
                        $('.file-tree .branch > .label').click (e) ->
                            $(this).parent().find('.leaf').toggle()
                            $(this).parent().find('.branch').toggle()
                        myList = $('.file-tree .branch > .leaf, .file-tree .branch > .leaf')
                        myList.each (index) ->
                            theElement = $(@)
                            theElement.sort (a, b) ->
                                a = if $(a).hasClass("branch") then 1 else 0
                                b = if $(b).hasClass("branch") then 1 else 0
                                return a - b;
                            theElement.parent().append(theElement)
            }
        ]
    }
    {
        label: 'View'
        submenu: [
            {
                label: 'Reload'
                accelerator: 'CmdOrCtrl+R'
                click: (item, focusedWindow) ->
                    if focusedWindow
                        focusedWindow.reload()
            }
            {
                label: 'Toggle Full Screen'
                accelerator: (-> if process.platform == 'darwin' then 'Ctrl+Command+F' else 'F11')()
                click: (item, focusedWindow) ->
                    if focusedWindow
                        focusedWindow.setFullScreen(not focusedWindow.isFullScreen())
            }
            {
                label: 'Toggle Dev Tools'
                accelerator: (-> if process.platform == 'darwin' then 'Alt+Command+I' else 'Ctrl+Shift+I')
                click: (item, focusedWindow) ->
                    if focusedWindow
                        focusedWindow.toggleDevTools()
            }
        ]
    }
]

menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)
