/* October 2009  
 
   UNISA eMarking Suite
   is delivered to UNISA under the 
   FLOSS licencing regime
 
   proudly developed by
 
   THE AESIR DEVELOPMENT SQUAD 
   www.aesir.co.za | info@aesir.co.za | +27 11 702 9000
 
      CREDITS
      Lead Developer    :: War Commander      :: Kyle Bowden
      Business Analyst  :: Field General      :: Willy Gadney
      Test Squad        :: Clean Out Crew     :: Herman Van Wyk & Tina Kanniah
      Dev Support       :: Backup             :: Nelson Baloyi
      LC Designer       :: Artillery          :: Lentswe Morule
      Installer         :: Mobilizer          :: Thabahla Shoko
      Enviro & Food     :: Crew Support       :: Khosi Gwala
      Architect         :: Special Operations :: Luigi D'Amico
*/

package bean {
	import mx.collections.ArrayCollection;
	
	/*
	   Proudly Developed By
	 
	   THE AESIR DEVELOPMENT SQUAD 
	   www.aesir.co.za | info@aesir.co.za | +27 11 702 9000
	*/
	public class DataBean {
		public var courseName:String = "";
	    public var assigmentNumber:String = "";
	    public var assigmentTotal:String = "";
	    public var rubricPath:String = "";
	    
	    public var firstTimeSave:Boolean = true;
	    
	    public var uniqueNum:int = -1;
	    public var isQuestionsEmpty:Boolean = true;
	    public var isCommentsEmpty:Boolean = true;
	    public var arrComments:ArrayCollection = new ArrayCollection();
	    public var arrQuestions:ArrayCollection = new ArrayCollection();
		
		public function DataBean() {}
		
		/*
		   Proudly Developed By
		 
		   THE AESIR DEVELOPMENT SQUAD 
		   www.aesir.co.za | info@aesir.co.za | +27 11 702 9000
		*/
		public function addQuestion(question:String):void {
	        arrQuestions.addItem(question);
	        
	        if(isQuestionsEmpty) {
	           isQuestionsEmpty = false;	
	        }
	    }
	    
	    public function deleteQuestion(index:int):void {
	    	var question:String = arrQuestions.getItemAt(index) as String;
	    	
	    	var obj:Object;
	    	var ques:String;
	    	var tempComments:ArrayCollection = new ArrayCollection();
	    	for(var i:int = 0; i < arrComments.length; i++) {
	    		obj = arrComments.getItemAt(i) as Object;
	    		ques = obj.key;
	    		
	    		if(question != ques) {
	    		   tempComments.addItem(obj);
	    		}
	    	}
	    	
	    	arrQuestions.removeItemAt(index);
	    	
	    	arrComments = tempComments;
	    }   
	    
	    /*
		   Proudly Developed By
		 
		   THE AESIR DEVELOPMENT SQUAD 
		   www.aesir.co.za | info@aesir.co.za | +27 11 702 9000
		*/
	    public function updateQuestion(index:int, question:String, oldQuestion:String):void {
	    	arrQuestions.setItemAt(question, index);
	    	updateCommentQuestionNumbers(question, oldQuestion);
	    }
	    
	    public function getQuestions():ArrayCollection {
	    	return arrQuestions;
	    }
	    
	    /*
		   Proudly Developed By
		 
		   THE AESIR DEVELOPMENT SQUAD 
		   www.aesir.co.za | info@aesir.co.za | +27 11 702 9000
		*/
	    public function checkExistingQuestion(question:String):Boolean {
	    	return arrQuestions.contains(question);
	    }
	    
	    public function addComment(question:String, comment:String, mark:String):int {
	    	uniqueNum++;
	    	
	    	var obj:Object = ({unique: uniqueNum, key: question, value: comment, mark: mark});
	    	arrComments.addItem(obj);
	        
	        if(isCommentsEmpty) {
	           isCommentsEmpty = false;	
	        }
	        
	        return uniqueNum;
	    }
	    
	    /*
		   Proudly Developed By
		 
		   THE AESIR DEVELOPMENT SQUAD 
		   www.aesir.co.za | info@aesir.co.za | +27 11 702 9000
		*/
	    public function deleteComment(un:int):void {
	    	var obj:Object = null;
	    	for(var i:int = 0; i < arrComments.length; i++) {
	    		obj = arrComments.getItemAt(i) as Object;
	    		
	    		if(obj.unique == un) {
	    		   arrComments.removeItemAt(i);
	    		   break;
	    		}
	    	}
	    }
	    
	    public function updateComment(questionID:int, question:String, comment:String, mark:String):void {
	    	var obj:Object = ({unique: questionID, key: question, value: comment, mark: mark});
	    	for(var i:int = 0; i < arrComments.length; i++) {
	    	    var tObj:Object = arrComments.getItemAt(i) as Object;
	    	    if(tObj.unique == questionID) {
	    	       arrComments.setItemAt(obj, i);
	    	       break;
	    	    }	
	    	}
	    }
	    
	    /*
		   Proudly Developed By
		 
		   THE AESIR DEVELOPMENT SQUAD 
		   www.aesir.co.za | info@aesir.co.za | +27 11 702 9000
		*/
	    public function updateCommentQuestionNumbers(question:String, oldQuestion:String):void {
	    	for(var i:int = 0; i < arrComments.length; i++) {
	    		var obj:Object = arrComments.getItemAt(i) as Object;
	    		
	    		if(obj.key == oldQuestion) {
	    		   var tObj:Object = ({unique: obj.unique, key: question, value: obj.value, mark: obj.mark});
	    		   arrComments.setItemAt(tObj, i);	
	    		}
	    	}
	    }
	    
	    public function getComments(question:String):ArrayCollection {
	    	var comments:ArrayCollection = new ArrayCollection();
	    	
	    	for(var i:int = 0; i < arrComments.length; i++) {
	    		var data:Object = (arrComments.getItemAt(i) as Object);
	    		
	    		if(data.key == question) {
	    		   comments.addItem({unique: data.unique, key: data.key, value: data.value, mark: data.mark});
	    		}
	    	}
	    	
	    	return comments;
	    }
	    
	    /*
		   Proudly Developed By
		 
		   THE AESIR DEVELOPMENT SQUAD 
		   www.aesir.co.za | info@aesir.co.za | +27 11 702 9000
		*/
	    public function setRubricPath(path:String):void {
	    	rubricPath = path;
	    }
	    
	    public function biuldXMLFile():XML {
	    	var defaultXML:String = "<?xml version='1.0' encoding='utf-8'?>" +
									"<unisa>" +
										"<commentfile course='' assignment='' total='' rubric=''>" +
										"</commentfile>" +
									"</unisa>";
									
			var questionXML:String = "<label num=''>" +	
									 "</label>";
									 
	        var commentXML:String = "<comment mark=''>" +
									"</comment>";
									
	    	var preXML:XML = new XML(defaultXML);
	    	
	    	preXML.commentfile[0].@course = courseName;
	    	preXML.commentfile[0].@assignment = assigmentNumber;
	    	preXML.commentfile[0].@total = assigmentTotal;
	    	preXML.commentfile[0].@rubric = rubricPath;
	    	
	    	if(arrQuestions.length != 0) {
		       for(var i:int = 0; i < arrQuestions.length; i++) {
		    	   var question:String = arrQuestions.getItemAt(i) as String;
		    	   
		    	   var preQuestionXML:XML = new XML(questionXML);
		    	   preQuestionXML.@num = question;
		    	   
		    	   for(var j:int = 0; j < arrComments.length; j++) {
		    	   	   var data:Object = arrComments.getItemAt(j) as Object;
		    	   	   var ques:String = data.key;
		    	   	   var comment:String = data.value;
		    	   	   var mark:String = data.mark;
		    	   	   
		    	   	   if(ques == question) {
			    	   	   var preCommentXML:XML = new XML(commentXML);
			    	   	   preCommentXML.@mark = mark;
			    	   	   preCommentXML.appendChild(comment);
			    	   	   preQuestionXML.appendChild(preCommentXML);
		    	   	   }
		    	   }
		    	   
		    	   preXML.commentfile[0].appendChild(preQuestionXML);
		       }
	    	}
	    	
	    	return preXML;
	    }
	    
	    /*
		   Proudly Developed By
		 
		   THE AESIR DEVELOPMENT SQUAD 
		   www.aesir.co.za | info@aesir.co.za | +27 11 702 9000
		*/
	    public function prepopulateDataFromXML(xml:XML):void {
	    	resetAllValues();
	    	
	    	courseName = xml.commentfile[0].@course;
		    assigmentNumber = xml.commentfile[0].@assignment;
		    assigmentTotal = xml.commentfile[0].@total; 
		    rubricPath = xml.commentfile[0].@rubric;
		    
		    var numberOfQuestions:int = xml.elements("commentfile").elements("label").length();
		    for(var i:int = 0; i < numberOfQuestions; i++) {
		    	addQuestion(xml.commentfile[0].label[i].@num);
		    	
		    	var numberOfComments:int = xml.elements("commentfile").elements("label")[i].elements("comment").length();
		    	for(var j:int = 0; j < numberOfComments; j++) {
		    		addComment(xml.commentfile[0].label[i].@num, xml.commentfile[0].label[i].comment[j].toString(), xml.commentfile[0].label[i].comment[j].@mark);
		    	}
		    }
	    }
	    
	    public function isFileInProgress():Boolean {
	    	var isBusy:Boolean = false;
	    	
	    	if(courseName == "" && assigmentNumber == "" && assigmentTotal == "" &&
	    	   arrQuestions.length == 0 && arrComments.length == 0) {
	    	   isBusy = false;
	    	} else {
	    	   isBusy = true;	
	    	}
	    	
	    	return isBusy;
	    }
	    
	    /*
		   Proudly Developed By
		 
		   THE AESIR DEVELOPMENT SQUAD 
		   www.aesir.co.za | info@aesir.co.za | +27 11 702 9000
		*/
	    public function resetAllValues():void {
	    	courseName = "";
	    	assigmentNumber = "";
	    	assigmentTotal = "";
	    	rubricPath = "";
	    	arrQuestions = new ArrayCollection();
	    	arrComments = new ArrayCollection();
	    }
	}
}