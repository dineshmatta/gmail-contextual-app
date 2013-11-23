// client Get requests requests are handled using this method.
function doGet(e) {
  var messageId=e.parameter.messageId;
  Logger.log('param messageId is : '+messageId);
  Logger.log('param callback is : '+e.parameter.callback);
  
  var attachmentDetails = getGmailAttachmentsById(messageId); //Gets attachment details
  var jsonResponse = Utilities.jsonStringify(attachmentDetails); //Prepare Json response
  
  return ContentService.createTextOutput(e.parameter.callback + "(" +jsonResponse+ ")")
        .setMimeType(ContentService.MimeType.TEXT);

}

// client Post requests requests are handled using this method.
function doPost(e) {
  var messageId=e.parameter.messageId;
  Logger.log('param messageId is : '+messageId);
  Logger.log('param callback is : '+e.parameter.callback);
  return ContentService.createTextOutput(e.parameter.callback + "(" +Utilities.jsonStringify(getGmailAttachmentsById(messageId)) + ")")
        .setMimeType(ContentService.MimeType.TEXT);
}

// This function will return the gmail attachment details 
function getGmailAttachmentsById(messageId){
   
  var message = GmailApp.getMessageById(messageId);
  if(message==null){
    Logger.log('No message found with Id : '+messageId);
    return;
  } 
  var attachmentDetails = new Array();

  var attachments = message.getAttachments();
  Logger.log('attachments count '+attachments.length);
  for (var k = 0; k < attachments.length; k++) {
    var attachment=attachments[k];
    
    var attachmentBlob = attachment.copyBlob();
    var attachmentFile =DocsList.createFile(attachmentBlob);
    
    attachmentDetails[k] = {title: attachment.getName(), size: attachment.getSize(), link: attachmentFile.getUrl()};
    
  }
  printAttachmentDetails(attachmentDetails);
  var jstring = Utilities.jsonStringify(attachmentDetails);
  Logger.log('jstring : '+ jstring);
  
  return attachmentDetails;
}

function printAttachmentDetails(attachmentDetails){
  Logger.log('attachments count '+attachmentDetails.length);
  for (var i = 0; i < attachmentDetails.length; i++) {
    Logger.log('Attachment "%s" size is "%s"(bytes), link is %s'
                ,attachmentDetails[i].title, attachmentDetails[i].size,attachmentDetails[i].link);
  }
    
  
}

//Test case method
function testgetGmailAttachmentsById(){
  var attachmentDetails = getGmailAttachmentsById('141ea63714d9640f');
  printAttachmentDetails(attachmentDetails);
}
