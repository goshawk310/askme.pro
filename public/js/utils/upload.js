'use strict';
(function (askmePro) {
    askmePro.upload = {
        settings: {
            maxFileSize: 2000000,
            messages: {
                maxNumberOfFiles: 'Maximum number of files exceeded',
                acceptFileTypes: 'File type not allowed',
                maxFileSize: 'File is too large',
                minFileSize: 'File is too small',
                serverError: 'Internal server error'
            },
            acceptFileTypes: {
                image: /(\.|\/)(gif|jpe?g|png)$/i,
            }
        },
        showProgress: function showProgress(progressElem) {
            progressElem.fadeIn();
        },
        hideProgress: function hideProgress(progressElem) {
            progressElem.fadeOut(400, function () {
                progressElem.children('.progress-bar').css({
                    width: '0'
                });
            });
        },
        setProgress: function setProgress(progressElem, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10);
            progressElem.children('.progress-bar').css({
                width: progress + '%'
            });
        },
        image: function image(formElem, progressElem, imgContainer, path, size, callback) {
            var thisObj = this;
            formElem.fileupload({
                acceptFileTypes: thisObj.settings.acceptFileTypes.image,
                maxFileSize: thisObj.settings.maxFileSize,
                dataType: 'json',
                done: function (e, data) {
                    if (typeof callback !== 'function') {
                        var filename = '',
                            ext = '',
                            imgClass = imgContainer.data('imgclass') || '',
                            imgId = imgContainer.data('imgid') || '';
                        askmePro.utils.showAlert(data.result);
                        if (data.result.status === 'success' && data.result.filename) {
                            if (size) {
                                ext = '.' + data.result.filename.split('.').pop();
                                filename = path + data.result.filename.replace(ext, '/' + size + ext);
                            } else {
                                filename = path + data.result.filename;
                            }
                            if (imgClass.length) {
                                imgClass = ' class="' + imgClass + '"';
                            }
                            if (imgId.length) {
                                imgId = ' id="' + imgId + '"';
                            }
                            imgContainer.html('<img src="' + filename + '"' + imgClass + imgId + '>');
                            imgContainer.prev('.panel-heading').find('button').removeClass('hidden');
                        }
                        thisObj.hideProgress(progressElem);
                    } else {
                        callback.call(thisObj, e, data, formElem, progressElem, imgContainer, path, size);
                    }
                },
                progressall: function (e, data) {
                    thisObj.setProgress(progressElem, data);
                },
                processalways: function (e, data) {
                    if (!data.files.error) {
                        data.submit();
                        thisObj.showProgress(progressElem);
                    } else {
                        askmePro.utils.showAlert({
                            status: 'error',
                            message: data.files[data.index].error
                        });
                    }
                },
                fail: function (e, data) {
                    askmePro.utils.showAlert({
                        status: 'error',
                        message: thisObj.settings.messages.serverError
                    });
                    thisObj.hideProgress(progressElem);
                },
                messages: askmePro.settings.upload.messages
            }).prop('disabled', !$.support.fileInput)
                .parent().addClass($.support.fileInput ? undefined : 'disabled');
            
        }
    };

})(askmePro);
