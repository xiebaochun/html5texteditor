//window.onload = function() {

  // Allow for vendor prefixes.
  window.requestFileSystem = window.requestFileSystem ||
                             window.webkitRequestFileSystem;


  // Create a variable that will store a reference to the FileSystem.
  var filesystem = null;

  // Get references to the page elements.
  var form = document.getElementById('file-form');
  var filenameInput = document.getElementById('filename');
  var contentTextArea = document.getElementById('content');

  var fileList = document.getElementById('file-list');

  var messageBox = document.getElementById('messages');

  // A simple error handler to be used throughout this demo.
  function errorHandler(error) {
    var message = '';

    switch (error.code) {
      case FileError.SECURITY_ERR:
        message = 'Security Error';
        $("#messages").css("color","red");
        messageBox.innerHTML = '请输入文件名或内容！';
        break;
      case FileError.NOT_FOUND_ERR:
        message = 'Not Found Error';
        break;
      case FileError.QUOTA_EXCEEDED_ERR:
        message = 'Quota Exceeded Error';
        break;
      case FileError.INVALID_MODIFICATION_ERR:
        message = 'Invalid Modification Error';
        break;
      case FileError.INVALID_STATE_ERR:
        message = 'Invalid State Error';
        break;
      default:
        message = 'Unknown Error';
        break;
    }
    console.log(message);
    messageBox.innerHTML = '请输入文件名或内容！';
  }


  // Request a FileSystem and set the filesystem variable.
  function initFileSystem() {
    //$("#52045565").attr("name","设计的妇女似的");
    messageBox.innerHTML = $("#categoryid").attr("style");
    navigator.webkitPersistentStorage.requestQuota(1024 * 1024 * 5,
      function(grantedSize) {

        // Request a file system with the new size.
        window.requestFileSystem(window.PERSISTENT, grantedSize, function(fs) {

          // Set the filesystem variable.
          filesystem = fs;

          // Setup event listeners on the form.
          setupFormEventListener();
          // Update the file browser.
          //check the directry is blank

          listFiles();

        }, errorHandler);

      }, errorHandler);
  }


  function loadFile(filename) {

    filesystem.root.getFile(filename, {}, function(fileEntry) {

      fileEntry.file(function(file) {
        var reader = new FileReader();

        reader.onload = function(e) {
          // Update the form fields.
          filenameInput.value = filename.split("/")[1];
          contentTextArea.value = this.result;
          editor.html(this.result);
        };

        reader.readAsText(file);
        //reader.readAsBinaryString(file);
        //reader.readAsArrayBuffer(file);
        //reader.readAsDataURL(file);
      }, errorHandler);

    }, errorHandler);
  }


  function displayEntries(entries) {
    // Clear out the current file browser entries.
    fileList.innerHTML = '';

    var t = $("#dir-list");
        t = $.fn.zTree.init(t, setting, zNodes);
    
    entries.forEach(function(entry, i) {
      //console.log(i);i=0,1,2,3,4,5
      var li = document.createElement('li');
     //var img ='<img src="images/file-icon.gif">'; 
      var img = entry.isDirectory ? '<img src="Images/folder-icon.gif">' :  
                                  '<img src="Images/file-icon.gif">';  

      var link = document.createElement('a');
      link.innerHTML = entry.name;
      link.innerHTML = [img, '<span>', entry.name, '</span>'].join('');  
      link.className = 'edit-file';
      li.appendChild(link);
      
      var delLink = document.createElement('a');
      delLink.innerHTML = '[x]';
      delLink.className = 'delete-file';
      li.appendChild(delLink);

      //fileList.appendChild(li);

     //在Ztree上列出所有的entry
      addNode(i,entry.name);
      // Setup an event listener that will load the file when the link
      // is clicked.
      link.addEventListener('click', function(e) {
        e.preventDefault();
        loadFile(entry.name);
      });

      // Setup an event listener that will delete the file when the delete link
      // is clicked.
      delLink.addEventListener('click', function(e) {
        e.preventDefault();
        deleteFile(entry.name);
      });

      filesystem.root.getDirectory(entry.name, {}, function(dirEntry){
           var dirReader = dirEntry.createReader();
            dirReader.readEntries(function(entries) {
      for(var i = 0; i < entries.length; i++) {
          var entry_01 = entries[i];
        if (entry_01.isDirectory){
          console.log('Directory: ' + entry_01.fullPath);
          var node = zTree.getNodeByParam("name", entry.name);
              zTree.addNodes(node, {id:(100), pId:node.id, isParent:true, name:entry_01.name},true);
            }
         else if (entry_01.isFile){
          console.log('File: ' + entry_01.fullPath);
          var node = zTree.getNodeByParam("name", entry.name);
              zTree.addNodes(node, {id:(100), pId:node.id, isParent:false, name:entry_01.name},true);
           }
            
          }
         
          }, errorHandler);
      }, errorHandler);

    });
  }


  function listFiles() {
    var dirReader = filesystem.root.createReader();
    var entries = [];//entries arrays

    var fetchEntries = function() {
      dirReader.readEntries(function(results) {

        if (!results.length) {//如果results.length=0
          displayEntries(entries.sort().reverse());   
          
        } else {
          entries = entries.concat(results);
          fetchEntries();
          console.log("fetch Entries!");
        }
        if(entries.length==0){//如果目录为空，则创建默认目录
          //alert("the entries is empty");
         //createDir(filesystem.root,'全部');
           //fetchEntries();
         //createDir('personalRecord'.split('/'));
         createDir(filesystem.root,"默认分类");
         createDir(filesystem.root,"个人记事");
         createDir(filesystem.root,"重要备忘");
         createDir(filesystem.root,'参考资料');
         createDir(filesystem.root,'休闲娱乐');
         createDir(filesystem.root,'小说故事');
         createDir(filesystem.root,'其他记事');
          readyDefaultNode();
          //fileList.appendChild(d);
        }
      }, errorHandler);
    };
     
    fetchEntries();
  }


  // Save a file in the FileSystem.
  function saveFile(filename, content) {

         
        

      filesystem.root.getFile($("#categoryid :selected").text()+"/"+filename, {create: true}, function(fileEntry) {
      
      fileEntry.createWriter(function(fileWriter) {

        fileWriter.onwriteend = function(e) {
          // Update the file browser.
          listFiles();
          
          // Clean out the form field.
          filenameInput.value = '';
          contentTextArea.value = '';
          editor.text("在这里输入你的内容...");
          //var zTree = $.fn.zTree.getZTreeObj("dir-list");
           var node = zTree.getNodeByParam("name", $("#categoryid :selected").text());
         zTree.addNodes(node, {id:(100), pId:123, isParent:false, name:filename},true);
          // Show a saved message.
           $("#messages").css("color","#69c773");
          messageBox.innerHTML = '文件保存成功!';

        };

        fileWriter.onerror = function(e) {
          console.log('Write error: ' + e.toString());
          alert('An error occurred and your file could not be saved!');
        };

        var contentBlob = new Blob([content], {type: 'text/plain'});

        fileWriter.write(contentBlob);

      }, errorHandler);

    }, errorHandler);
  }


  function deleteFile(filename) {
    
    //console.log(zTree.getSelectedNodes()[0].name);
    console.log("delete file");
    filesystem.root.getFile(filename, {create: false}, function(fileEntry) {

      fileEntry.remove(function(e) {
        // Update the file browser.
        listFiles();

        // Show a deleted message.
        $("#messages").css("color","#898911");
        messageBox.innerHTML = '文件删除成功!';
      }, errorHandler);

    }, errorHandler);
  }


  // Add event listeners on the form.
  function setupFormEventListener() {

    form.addEventListener('submit', function(e) {
      e.preventDefault();

      // Get the form data.
      var filename = filenameInput.value;
      var content = contentTextArea.value;
          content=editor.html();

      // Save the file.
      saveFile(filename, content);
    });
    $("#deleteFile").click(function(){
      
      console.log(zTree.getSelectedNodes()[0].getParentNode().name);
      //if(zTree.getSelectedNodes()[0].getParentNode().name)
      deleteFile(zTree.getSelectedNodes()[0].getParentNode().name+"/"+zTree.getSelectedNodes()[0].name);

    });

  }
////create file Directory


function createDir(parentPath,folders) {
  parentPath.getDirectory(folders, {create: true}, function(dirEntry) {
    // if (folders.length) {
    //   createDir(dirEntry, folders.slice(1));
    // }
  }, errorHandler);
}
  // Start the app by requesting a FileSystem (if the browser supports the API)
  if (window.requestFileSystem) {
    initFileSystem();
  } else {
    alert('Sorry! Your browser doesn\'t support the FileSystem API :(');
  }


//};
