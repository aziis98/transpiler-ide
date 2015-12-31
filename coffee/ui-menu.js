var Menu, dialog, menu, path, remote, template;

path = require('path');

remote = require('electron').remote;

dialog = remote.dialog;

Menu = remote.Menu;

template = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Open Folder',
        click: function(item, focusedWindow) {
          var theFolder;
          theFolder = dialog.showOpenDialog({
            properties: ['openDirectory']
          });
          console.log(theFolder);
          return diretoryTreeToObj(theFolder[0], function(err, res) {
            var htmlStructure, myList;
            $('.file-tree').empty();
            htmlStructure = '';
            htmlStructure += '<div class="branch">';
            htmlStructure += '<div class="label">' + path.basename(theFolder) + '</div>';
            _.each(res, function(fileNode) {
              if (fileNode.isFile) {
                return htmlStructure += '<div class="leaf">' + fileNode.name + '</div>';
              } else if (fileNode.isFolder) {
                return fileNode.each((function(fileNode) {
                  if (fileNode.isFile) {
                    return htmlStructure += '<div class="leaf">' + fileNode.name + '</div>';
                  } else if (fileNode.isFolder) {
                    htmlStructure += '<div class="branch">';
                    htmlStructure += '<div class="label">' + fileNode.name + '</div>';
                    console.log(fileNode);
                    if (fileNode.isLarge) {
                      return htmlStructure += '<div class="leaf">...</div>';
                    }
                  }
                }), (function(fileNode) {
                  return htmlStructure += '</div>';
                }));
              }
            });
            htmlStructure += '</div>';
            $('.file-tree').html(htmlStructure);
            $('.file-tree .branch > .label').click(function(e) {
              $(this).parent().find('.leaf').toggle();
              return $(this).parent().find('.branch').toggle();
            });
            myList = $('.file-tree .branch > .leaf, .file-tree .branch > .leaf');
            return myList.each(function(index) {
              var theElement;
              theElement = $(this);
              theElement.sort(function(a, b) {
                a = $(a).hasClass("branch") ? 1 : 0;
                b = $(b).hasClass("branch") ? 1 : 0;
                return a - b;
              });
              return theElement.parent().append(theElement);
            });
          });
        }
      }
    ]
  }, {
    label: 'View',
    submenu: [
      {
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click: function(item, focusedWindow) {
          if (focusedWindow) {
            return focusedWindow.reload();
          }
        }
      }, {
        label: 'Toggle Full Screen',
        accelerator: (function() {
          if (process.platform === 'darwin') {
            return 'Ctrl+Command+F';
          } else {
            return 'F11';
          }
        })(),
        click: function(item, focusedWindow) {
          if (focusedWindow) {
            return focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
          }
        }
      }, {
        label: 'Toggle Dev Tools',
        accelerator: (function() {
          if (process.platform === 'darwin') {
            return 'Alt+Command+I';
          } else {
            return 'Ctrl+Shift+I';
          }
        }),
        click: function(item, focusedWindow) {
          if (focusedWindow) {
            return focusedWindow.toggleDevTools();
          }
        }
      }
    ]
  }
];

menu = Menu.buildFromTemplate(template);

Menu.setApplicationMenu(menu);
