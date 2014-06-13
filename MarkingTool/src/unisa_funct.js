/* October 2009  
 
   UNISA eMarking Suite
   is delivered to UNISA under the 
   FLOSS licencing regime
 
   Proudly Developed By
 
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

var firstInitialization = true;

var count = 0;
var isPortrait = true;
var hasMarkingButtons = false;
var addDeselectIcon;
var isDeselect = false;

var isHalfMarkIndented = false;
var isTickIndented = false;
var isCheckIndented = false;
var isCrossIndented = false;
var isMarkIndented = false;
var isCommentMarkIndented = false;

var commentFromFile = "";
var labelForMark = "";

var firstMarkForTick = true;
var currentMarkForTick = 1;

var totalMarks = 0;
var assigmentTotal = -1;

var resultsPageNumber = -1;

var skipRemoveButtons = false;

var attachedRubricMark = "";
var hasRubricAttached = false;

var skipTotalDialog = false;

var rubricDoc;
var currentRubricOpened = "";

/*
   Proudly Developed By
 
   THE AESIR DEVELOPMENT SQUAD 
   www.aesir.co.za | info@aesir.co.za | +27 11 702 9000
*/
var addMark = app.trustedFunction(
   function(aNewDoc, type) {
      app.beginPriv();
      
      if(firstInitialization) {
          
         try {
           var edtSpecial = aNewDoc.getField("ResultPage");
           
           resultsPageNumber = edtSpecial.page;
         } catch(Error) {}
         
         firstInitialization = false;
      }
      
      if(resultsPageNumber != -1) {
         aNewDoc.deletePages(resultsPageNumber);
         
         resultsPageNumber = -1;
      }
      
      if(hasMarkingButtons == true) {
         removeContinuesMarking(aNewDoc);
      }
      
      switch(type) {
         case 'HALFT': { 
                         isHalfMarkIndented = true;
                         isTickIndented = false;
                         isCheckIndented = false;
                         isCrossIndented = false;
                         isMarkIndented = false;
                         isCommentMarkIndented = false;
                         break;}
         case 'TICK': {  
                         isHalfMarkIndented = false;
                         isCheckIndented = false;
                         isCrossIndented = false;
                         isMarkIndented = false;
                         isCommentMarkIndented = false;
                         
                         if(firstMarkForTick) {
                            hasMarkingButtons = getTickMarkDialog(aNewDoc); 
                            
                            firstMarkForTick = false; 
                         } 
                         if(hasMarkingButtons == false) { 
                           isTickIndented = true;
                         } else {
                           isTickIndented = false;
                         }
                         break;}
         case 'CHECK': { 
                         isHalfMarkIndented = false;
                         isTickIndented = false;
                         isCheckIndented = true;
                         isCrossIndented = false;
                         isMarkIndented = false; 
                         isCommentMarkIndented = false;
                         break;}
         case 'CROSS': { 
                         isHalfMarkIndented = false;
                         isTickIndented = false;
                         isCheckIndented = false;
                         isCrossIndented = true;
                         isMarkIndented = false; 
                         isCommentMarkIndented = false;
                         break;}
         case 'MARK': { 
                         isHalfMarkIndented = false;
                         isTickIndented = false;
                         isCheckIndented = false;
                         isCrossIndented = false;
                         isMarkIndented = true; 
                         isCommentMarkIndented = false;
                         break;}
         case 'COMMENTM':{
                         isHalfMarkIndented = false;
                         isTickIndented = false;
                         isCheckIndented = false;
                         isCrossIndented = false;
                         isMarkIndented = false; 
                         isCommentMarkIndented = true;
                         break;}
      }
      
      if(hasMarkingButtons == false) {     
         isDeselect = true;
         
         addMarkingButtons(aNewDoc, type);
         
         hasMarkingButtons = true;
      }
    
      app.endPriv();  
   }
);

var setEnableOnDeselect = app.trustedFunction(
   function() {
      event.rc = isDeselect;
   }
);

/*
   Proudly Developed By
 
   THE AESIR DEVELOPMENT SQUAD 
   www.aesir.co.za | info@aesir.co.za | +27 11 702 9000
*/
var setIndentOnHalfTick = app.trustedFunction(
   function() {
      event.rc = isHalfMarkIndented; 
   }
);
var setIndentOnTick = app.trustedFunction(
   function() {
      event.rc = isTickIndented; 
   }
);
var setIndentOnCheck = app.trustedFunction(
   function() {
      event.rc = isCheckIndented; 
   }
);
var setIndentOnCross = app.trustedFunction(
   function() {
      event.rc = isCrossIndented; 
   }
);
var setIndentOnMark = app.trustedFunction(
   function() {
      event.rc = isMarkIndented; 
   }
);

/*
   Proudly Developed By
 
   THE AESIR DEVELOPMENT SQUAD 
   www.aesir.co.za | info@aesir.co.za | +27 11 702 9000
*/
var setIndentOnCommentMark = app.trustedFunction(
   function() {
      event.rc = isCommentMarkIndented;
   }
);

var removeContinuesMarking = app.trustedFunction(
   function(aNewDoc) {
      app.beginPriv();    
      
      isDeselect = false;
      isHalfMarkIndented = false;
      isTickIndented = false;
      isCheckIndented = false;
      isCrossIndented = false;
      isMarkIndented = false;
      isCommentMarkIndented = false;
      
      firstMarkForTick = true;
      
      removeMarkingButtons(aNewDoc);   
      hasMarkingButtons = false;
      
      app.endPriv();
   }
);

/*
   Proudly Developed By
 
   THE AESIR DEVELOPMENT SQUAD 
   www.aesir.co.za | info@aesir.co.za | +27 11 702 9000
*/
var doAimAnnot = app.trustedFunction(
   function(aNewDoc, x, y) {
      app.beginPriv();
      
      var drawPoints = [];
      var points1 = drawArc(0, 0, 0, 360, 15);
      var points2 = drawArc(0, 0, 0, 360, 10);
      var points3 = drawArc(0, 0, 0, 360, 5);
      
      drawPoints[0] = points1;
      drawPoints[1] = points2;
      drawPoints[2] = points3;
      
      drawPoints = rotateObjectPoints(drawPoints, aNewDoc, x, y);
      
      aNewDoc.addAnnot({
         type: "Ink",
         page: aNewDoc.pageNum,
         name: "AIM",
         gestures: drawPoints,
         opacity: 0.5,
         strokeColor: color.red,
         width: 1
      }); 
      
      app.endPriv();
   }
);

var doMark = app.trustedFunction(
   function(aNewDoc, type) {
      app.beginPriv();
      
      var currentPage = aNewDoc.pageNum;
      
      var dialog;
      
      if(type == "COMMENTM") {
         doAimAnnot(aNewDoc, aNewDoc.mouseX, aNewDoc.mouseY);
         
         dialog = getCommentMarkDialog(aNewDoc, aNewDoc.mouseX, aNewDoc.mouseY, type);
         
         app.execDialog(dialog);
         
         if(skipRemoveButtons == false) {
            removeContinuesMarking(aNewDoc);
         } else {
            skipRemoveButtons = false;
         }
      } else
      if(type == "MARK") {
         doAimAnnot(aNewDoc, aNewDoc.mouseX, aNewDoc.mouseY);
         
         dialog = getMarkDialog(aNewDoc, aNewDoc.mouseX, aNewDoc.mouseY, type);
         
         app.execDialog(dialog);
         
         if(skipRemoveButtons == false) {
            removeContinuesMarking(aNewDoc);
         } else {
            skipRemoveButtons = false;
         }
      } else
      if(type == "TICK") {
         doAnnot(aNewDoc, aNewDoc.mouseX, aNewDoc.mouseY, null, currentMarkForTick, type);
      } else
      if(type == "CROSS") {
         doAnnot(aNewDoc, aNewDoc.mouseX, aNewDoc.mouseY, null, 0, type);
      } else
      if(type == "CHECK") {
         doAnnot(aNewDoc, aNewDoc.mouseX, aNewDoc.mouseY, null, 0, type);
      } else
      if(type == "HALFT") {
         doAnnot(aNewDoc, aNewDoc.mouseX, aNewDoc.mouseY, null, 0.5, type);
      }
          
      app.endPriv();
   }
);

/*
   Proudly Developed By
 
   THE AESIR DEVELOPMENT SQUAD 
   www.aesir.co.za | info@aesir.co.za | +27 11 702 9000
*/
var doAnnot = app.trustedFunction(
   function(aNewDoc, x, y, q, m, type) {
       app.beginPriv();
       
       var currentPage = aNewDoc.pageNum;

       var tickPoints;
       var crossPoints;
       var checkPoints;
       var circlePoints;
       var numberPoints;
       
       var graphicType = "";
       var qmAnnot = false;
       
       var drawPoints = [];
       
       var hasSubjectForAnnot = false;
       
       if(type == "COMMENTM") { 
          numberPoints = createNumbers(aNewDoc, x, y, m);
          
          drawPoints = numberPoints;
          
          graphicType = "COMMENTM";
          
          qmAnnot = true;
          hasSubjectForAnnot = true;
       } else
       if(type == "MARK") { 
          numberPoints = createNumbers(aNewDoc, x, y, m);
          
          drawPoints = numberPoints;
          
          graphicType = "MARK";
          
          qmAnnot = true;
       } else
       if(type == "TICK") {
          tickPoints = createTick(aNewDoc, x, y);
          
          drawPoints = [tickPoints];
          
          graphicType = "TICK";
       } else
       if(type == "CROSS") {
          crossPoints = createCross(aNewDoc, x, y);
          
          drawPoints = crossPoints;
          
          m = 0;
          
          graphicType = "CROSS";
       } else
       if(type == "CHECK") {
          checkPoints = createCheck(aNewDoc, x, y);
          
          drawPoints = [checkPoints];
          
          m = 0;
          
          graphicType = "CHECK";
       } else
       if(type == "HALFT") {
          crossPoints = createHalfTick(aNewDoc, x, y);
          
          drawPoints = crossPoints;
          
          m = 0.5;
          
          graphicType = "HALFT";
       }
       
       if(!qmAnnot) {
          aNewDoc.addAnnot({
             type: "Ink",
             page: currentPage,
             name: graphicType + ":" + count,
             subject: "MARK | " + m,
             gestures: drawPoints,
             width: 2
          });
       } else {
          if(hasSubjectForAnnot) {
            aNewDoc.addAnnot({
               type: "Ink",
               page: currentPage,
               name: graphicType + ":" + count,
               subject: "MARK: " + q + " | " + m,
               gestures: drawPoints,
               contents: commentFromFile,
               width: 2
            });
          } else {
            aNewDoc.addAnnot({
               type: "Ink",
               page: currentPage,
               name: graphicType + ":" + count,
               subject: "MARK: " + q + " | " + m,
               gestures: drawPoints,
               width: 2
            });
          }
       }
       
       count++;
       
       app.endPriv();
   }
);

/*
   Proudly Developed By
 
   THE AESIR DEVELOPMENT SQUAD 
   www.aesir.co.za | info@aesir.co.za | +27 11 702 9000
*/
var createNumbers = app.trustedFunction(
   function(aNewDoc, x, y, m) {
       var currentPage = aNewDoc.pageNum;
       
       var currentPageRotation = aNewDoc.getPageRotation({nPage: currentPage});
       
       var bufferx = 0;
       var buffery = 0;
       var currx = x;
       var curry = y;
       
       if(currentPageRotation == 90) {   
          isPortrait = false;
       } else {
          isPortrait = true;
       }
       
       var drawPoints = [];
       var circlePoints = [];
       
       var flag = -1;
       var hasTwoNumbers = false;
       var hasThreeNumbers = false;
       var createHalfMark = false;
       var isOnehundred = false;
       var isNegative = false;
       var number1 = -1;
       var number2 = -1;
       var number3 = -1;
       
       var halfmarkPoints = [];
       var countPointArrays = -1;   
       
       if(m < 0) {
          m = m.substring(1, m.length);
        
          isNegative = true;
       }    
       
       if(m <= 9.5 && m >= 0) {
          circlePoints = drawCircle(bufferx, buffery, 22);
          
          var numberhalf = m.substring(m.indexOf("."), m.indexOf(".")+1);
          
          if(numberhalf == ".") {
             number1 = m.substring(0, 1);
             number2 = m.substring(m.indexOf(".")+1, m.length);
             m = number1;
             bufferx -= 6;
          
             hasTwoNumbers = true;
             createHalfMark = true; 
          }
       } else
       if(m > 9.5 && m <= 100) {
           circlePoints = drawCircle(bufferx, buffery, 22);
          
          number1 = m.substring(0, 1);
          
          if(m == 100) { 
             m = '1';
             number2 = '0';
             number3 = '0';
             bufferx -= 10;
             
             isOnehundred = true;
             hasThreeNumbers = true;            
          } else
          if(m.length == 4) {
             number2 = m.substring(1, m.indexOf("."));
             number3 = m.substring(m.indexOf(".")+1, m.length);
             
             m = number1;
             bufferx -= 11;
             
             hasThreeNumbers = true;
          } else {
             number2 = m.substring(1, m.length);
             
             m = number1;
             bufferx -= 5;
       
             hasTwoNumbers = true;
          }   
       }

       countPointArrays++;
       drawPoints[countPointArrays] = circlePoints; 
        
       var joinTwoPoints = false;
       var joinThreePoints = false;
       while(flag == -1) {

       switch(m) {
            case '0':{
                      mx = bufferx;
                      my = buffery;
                      
                      cx = bufferx;
                      cy = buffery+2.5;
                      
                      cx2 = bufferx;
                      cy2 = buffery-2;
                     
                      var points1 = drawArc(cx, cy, 182, -2, 3);
                      var points2 = [];
                      points2[0] = [mx+3, my+2.5];
                      points2[1] = [mx+3, my-2];
                      var points3 = [];
                      points3[0] = [mx-3, my+2.5];
                      points3[1] = [mx-3, my-2];
                      var points4 = drawArc(cx2, cy2, 178, 362, 3);

                      countPointArrays++;
                      drawPoints[countPointArrays] = points1;
                      countPointArrays++;
                      drawPoints[countPointArrays] = points2;
                      countPointArrays++;
                      drawPoints[countPointArrays] = points3;
                      countPointArrays++;
                      drawPoints[countPointArrays] = points4;
                      break;
                     }   
            case '1':{   
                      mx = bufferx;
                      my = buffery;
                      
                      var points1 = [];
                      points1[0] = [mx-3, my+3];
                      points1[1] = [mx, my+5];
                      points1[2] = [mx, my-5];
                      var points2 = [];
                      points2[0] = [mx-4, my-5];
                      points2[1] = [mx+4, my-5];
                      
                      countPointArrays++;
                      drawPoints[countPointArrays] = points1;
                      countPointArrays++;
                      drawPoints[countPointArrays] = points2;
                      break;
                     }
            case '2':{
                      mx = bufferx;
                      my = buffery;
                      
                      cx = bufferx;
                      cy = buffery+2;
                      
                      var points1 = drawArc(cx, cy, 182, -9, 3);
                      var points2 = [];
                      points2[0] = [mx+3, my+2];
                      points2[1] = [mx-3, my-5]; 
                      points2[2] = [mx+4, my-5];
                      
                      countPointArrays++;
                      drawPoints[countPointArrays] = points1; 
                      countPointArrays++;
                      drawPoints[countPointArrays] = points2;               
                      break;
                     }
            case '3':{
                      mx = bufferx;
                      my = buffery;
                      
                      cx = bufferx;
                      cy = buffery+2.5;
                      
                      cx2 = bufferx;
                      cy2 = buffery-2.5;
                      
                      var points1 = [];
                      points1[0] = [mx-3.5, my+5];
                      points1[1] = [mx+0.5, my+5];
                      var points2 = drawArc(cx, cy, 90, -90, 2.5);
                      var points3 = [];
                      points3[0] = [mx-2.5, my];
                      points3[1] = [mx+0.5, my];
                      var points4 = drawArc(cx2, cy2, 90, -90, 2.5);
                      var points5 = [];
                      points5[0] = [mx-3.5, my-5];
                      points5[1] = [mx+0.5, my-5];
                      
                      countPointArrays++;
                      drawPoints[countPointArrays] = points1;
                      countPointArrays++;
                      drawPoints[countPointArrays] = points2;
                      countPointArrays++;
                      drawPoints[countPointArrays] = points3;
                      countPointArrays++;
                      drawPoints[countPointArrays] = points4;
                      countPointArrays++;
                      drawPoints[countPointArrays] = points5;
                      break;
                     }
            case '4':{
                      mx = bufferx;
                      my = buffery;
                      
                      var points1 = [];
                      points1[0] = [mx+4, my-3];
                      points1[1] = [mx-4, my-3];
                      points1[2] = [mx+1, my+5.5];
                      var points2 = [];
                      points2[0] = [mx+1, my+6];
                      points2[1] = [mx+1, my-6];
                      
                      countPointArrays++;
                      drawPoints[countPointArrays] = points1;
                      countPointArrays++;
                      drawPoints[countPointArrays] = points2;
                      break;
                     }
            case '5':{
                      mx = bufferx;
                      my = buffery;
                      
                      cx = bufferx;
                      cy = buffery-2;
                      
                      var points1 = [];
                      points1[0] = [mx+3.5, my+5];
                      points1[1] = [mx-2, my+5];
                      var points2 = [];
                      points2[0] = [mx-2, my+6];
                      points2[1] = [mx-2, my];
                      var points3 = [];
                      points3[0] = [mx-2, my+1];
                      points3[1] = [mx+1, my+1];
                      var points4 = drawArc(cx, cy, 90, -90, 3);
                      var points5 = [];
                      points5[0] = [mx+1, my-5];
                      points5[1] = [mx-3, my-5];
                      
                      countPointArrays++;
                      drawPoints[countPointArrays] = points1;
                      countPointArrays++;
                      drawPoints[countPointArrays] = points2;
                      countPointArrays++;
                      drawPoints[countPointArrays] = points3;
                      countPointArrays++;
                      drawPoints[countPointArrays] = points4;
                      countPointArrays++;
                      drawPoints[countPointArrays] = points5;
                      break;
                     }
            case '6':{
                      mx = bufferx;
                      my = buffery;
                      
                      cx = bufferx;
                      cy = buffery+2;
                      
                      cx2 = bufferx;
                      cy2 = buffery-2.5;
                      
                      var points1 = drawArc(cx, cy, 10, 180, 3);  
                      var points2 = [];
                      points2[0] = [mx-3, my+2.5];
                      points2[1] = [mx-3, my-2.5];
                      var points3 = drawArc(cx2, cy2, 0, 360, 3);  

                      countPointArrays++;
                      drawPoints[countPointArrays] = points1;
                      countPointArrays++;
                      drawPoints[countPointArrays] = points2;
                      countPointArrays++;
                      drawPoints[countPointArrays] = points3;
                      break;
                     }
            case '7':{    
                      mx = bufferx;
                      my = buffery;
                      
                      var points1 = [];
                      points1[0] = [mx-4, my+5];
                      points1[1] = [mx+4, my+5];
                      points1[2] = [mx-2, my-6];
                      
                      countPointArrays++;
                      drawPoints[countPointArrays] = points1;
                      break;
                     }
            case '8':{
                      cx = bufferx;
                      cy = buffery+3;
                      
                      cx2 = bufferx;
                      cy2 = buffery-2;
                         
                      var points1 = drawArc(cx, cy, -60, 240, 2.5);
                      var points2 = drawArc(cx2, cy2, 0, 360, 3);
                      
                      countPointArrays++;
                      drawPoints[countPointArrays] = points1;
                      countPointArrays++;
                      drawPoints[countPointArrays] = points2;
                      break;
                     }
            case '9':{
                      mx = bufferx;
                      my = buffery;
                      
                      cx = bufferx;
                      cy = buffery+2.5;
                      
                      cx2 = bufferx;
                      cy2 = buffery-2;
                      
                      var points1 = drawArc(cx, cy, 0, 360, 3);  
                      var points2 = [];
                      points2[0] = [mx+3, my+2.5];
                      points2[1] = [mx+3, my-2.5];
                      var points3 = drawArc(cx2, cy2, 0, -170, 3);  

                      countPointArrays++;
                      drawPoints[countPointArrays] = points1;
                      countPointArrays++;
                      drawPoints[countPointArrays] = points2;
                      countPointArrays++;
                      drawPoints[countPointArrays] = points3;
                      break;
                     }
          } 
       
          if(hasTwoNumbers == false && hasThreeNumbers == false) {
             flag = 0;
          }
          
          if(joinTwoPoints == true) { 
             hasTwoNumbers = false;
             
             
             flag = 0; 
             break; 
          }
          
          if(isNegative) {
             var points = [];
             points[0] = [bufferx-9, buffery];
             points[1] = [bufferx-5, buffery];
             countPointArrays++;
             drawPoints[countPointArrays] = points;
             
             isNegative = false;
          }
          
          if(joinThreePoints == true) {
             flag = -1;
             
             joinThreePoints = false;
             joinTwoPoints = true;
             hasThreeNumbers = false;
             
             if(!isOnehundred) {
               var points = [];
               points[0] = [bufferx + 5, buffery-5];
               points[1] = [bufferx + 7, buffery-5];
               countPointArrays++;
               drawPoints[countPointArrays] = points;
               
               bufferx += 12.5;
             } else {
               bufferx += 10;
             }
             
             m = number3;           
          }
          
          if(hasThreeNumbers == true) {
             flag = -1;
             
             joinThreePoints = true;
             
             m = number2;
             bufferx += 10;
          } else
          if(hasTwoNumbers == true) {
             flag = -1;
             
             joinTwoPoints = true;
             
             if(createHalfMark) {
               var points = [];
               points[0] = [bufferx + 5, buffery-5];
               points[1] = [bufferx + 7, buffery-5];
               countPointArrays++;
               drawPoints[countPointArrays] = points;

               bufferx += 11;
             } else { 
               bufferx += 10;
             }
             m = number2;
          }      
       }
       
       drawPoints = rotateObjectPoints(drawPoints, aNewDoc, currx, curry);
 
       return drawPoints;
   }
);

var rotateObjectPoints = app.trustedFunction(
   function(drawPoints, aNewDoc, currx, curry) {
       var currentPage = aNewDoc.pageNum;
       
       var currentPageRotation = aNewDoc.getPageRotation({nPage: currentPage});
       
       var pageSizeBox = aNewDoc.getPageBox("Crop");
       var width = pageSizeBox[2] - pageSizeBox[0];
       var height = pageSizeBox[1] - pageSizeBox[3];
       
       var arr = [];
       var innerX;
       var innerY;
       var mxFromRot;
       for(var i = 0; i < drawPoints.length; i++) {
           arr = drawPoints[i];
           mxFromRot = (new Matrix2D).fromRotated(aNewDoc, aNewDoc.pageNum);
           drawPoints[i] = mxFromRot.transform(arr);
       }

       for(i = 0; i < drawPoints.length; i++) {    
          arr = drawPoints[i];    
          for(j = 0; j < arr.length; j++) {
             innerX = arr[j][0];
             innerY = arr[j][1];

             if(currentPageRotation == 0) {
                innerX = innerX + currx;
                innerY = innerY + curry;
             } else 
             if (currentPageRotation == 90) {
                innerX = innerX + currx - width;
                innerY = innerY + curry;
             } else 
             if (currentPageRotation == 180) {
                innerX = innerX + currx - width;
                innerY = innerY + curry - height;
             } else 
             if (currentPageRotation == 270) {
                innerX = innerX + currx;
                innerY = innerY + curry - width;
             }
             

             arr[j][0] = innerX;
             arr[j][1] = innerY;
           }
           
          drawPoints[i] = arr;
      }
      
      return drawPoints;
   }
);

/*
   Proudly Developed By
 
   THE AESIR DEVELOPMENT SQUAD 
   www.aesir.co.za | info@aesir.co.za | +27 11 702 9000
*/
var drawCircle = app.trustedFunction(
   function(x, y, radius) {
      
      var angle = 0.1;
      var nNodes = 360;
      var circlePoints = new Array();
      for (var i = 0; i < nNodes; i++) {
        circlePoints[i] = [x + Math.cos(angle)*radius, y + Math.sin(angle)*radius];

        angle += 0.1;
      }   
      
      return circlePoints; 
   }
);

var degreesToRadians = app.trustedFunction(
   function(degrees) {
       return degrees*Math.PI/180;
   }
);


/*
   Proudly Developed By
 
   THE AESIR DEVELOPMENT SQUAD 
   www.aesir.co.za | info@aesir.co.za | +27 11 702 9000
*/
var drawArc = app.trustedFunction(
   function(x, y, start_degree, end_degree, radius) {
      var points = [];
      
      var angle = start_degree;
      var i = 0;
      
      if(start_degree > end_degree) {
         while (angle >= end_degree) {
            points[i] = [parseFloat(x + Math.cos(degreesToRadians(angle))*radius), parseFloat(y + Math.sin(degreesToRadians(angle))*radius)];
            angle -= 1;
            i++;
         }
         
      } else {
         while (angle <= end_degree) {
            points[i] = [parseFloat(x + Math.cos(degreesToRadians(angle))*radius), parseFloat(y + Math.sin(degreesToRadians(angle))*radius)];
            angle += 1;
            i++;
         }
      }
      
      return points;
   }
);

var createCross = app.trustedFunction(
   function(aNewDoc, x, y) {   
       var drawPoints = [];
       var points = [];
       var points2 = [];
       
       var bufferx = 0;
       var buffery = 0;
       
       points[0] = [bufferx+6, buffery+10];
       points[1] = [bufferx-6, buffery-2];
     
       points2[0] = [bufferx-6, buffery+10];
       points2[1] = [bufferx+6, buffery-2];
       
       drawPoints = [points, points2];
       var arr = rotateObjectPoints(drawPoints, aNewDoc, x, y);
       drawPoints = arr;
       
       return drawPoints;
   }
);

/*
   Proudly Developed By
 
   THE AESIR DEVELOPMENT SQUAD 
   www.aesir.co.za | info@aesir.co.za | +27 11 702 9000
*/
var createTick = app.trustedFunction(
   function(aNewDoc, x, y) {      
       var drawPoints = []; 
       var points = [];
       
       var bufferx = 0;
       var buffery = 0;
       
       points[0] = [bufferx+11, buffery+10];
       points[1] = [bufferx, buffery];
       points[2] = [bufferx-4, buffery+4];
       
       drawPoints = [points];
       var arr = rotateObjectPoints(drawPoints, aNewDoc, x, y);
       drawPoints = arr[0];
       
       return drawPoints;
   }
);

var createHalfTick = app.trustedFunction(
   function(aNewDoc, x, y) {      
       var drawPoints = []; 
       var points = [];
       var points2 = [];
       
       var bufferx = 0;
       var buffery = 0;
       
       points[0] = [bufferx+11, buffery+10];
       points[1] = [bufferx, buffery];
       points[2] = [bufferx-4, buffery+4];
       
       points2[0] = [bufferx+11.25, buffery+10.75];
       points2[1] = [bufferx+11.25, buffery+5];
       
       drawPoints = [points, points2];
       var arr = rotateObjectPoints(drawPoints, aNewDoc, x, y);
       drawPoints = arr;
       
       return drawPoints;
   }
);

/*
   Proudly Developed By
 
   THE AESIR DEVELOPMENT SQUAD 
   www.aesir.co.za | info@aesir.co.za | +27 11 702 9000
*/
var createCheck = app.trustedFunction(
   function(aNewDoc, x, y) {   
       var drawPoints = []; 
       var points1 = [];
       var points2 = [];
       
       var bufferx = 0;
       var buffery = 0;
       
       points1[0] = [bufferx-6, buffery-6];
       points1[1] = [bufferx, buffery];
       points1[2] = [bufferx+4, buffery-14];
       
       drawPoints = [points1];
       var arr = rotateObjectPoints(drawPoints, aNewDoc, x, y);
       drawPoints = arr[0];
       
       return drawPoints;
   }
);

var getCommentMarkDialog = app.trustedFunction(
   function(aNewDoc, x, y, type) {
       app.beginPriv();
       
       var qc = "";
       
       var dialog1 = {
        initialize: function (dialog) {
            var todayDate = dialog.store()["date"];
            todayDate = "Date: " + util.printd("mmmm dd, yyyy", new Date());
            dialog.load({ "date": todayDate });
            
            var arrText = readCommentTextFile(aNewDoc, "COMM_ENGINE");
            
            var qn = ""+arrText[1];
            var qm = ""+arrText[2];
            
            if(qn == "</empty>") {
               qn = "";
            }
            if(qm == "</empty>") {
               qm = "";
            }
            
            var txt = "";
            for(var i = 3; i < arrText.length-1; i++) {
                 txt = ""+arrText[i];
                 if(txt == "</p>") {
                    qc = qc+"\n";
                 } else {
                    qc = qc+txt+"\n";
                 }
            }
            
            if(arrText[3] == "</empty>") {
               qc = "";
            }
            
            dialog.load({ "mark": qm});
            dialog.load({ "ques": qn});
            dialog.load({ "comm": qc});
        },
        destroy:function (dialog) {
            var aim_annot = aNewDoc.getAnnot({ nPage: aNewDoc.pageNum, cName: "AIM"});
            aim_annot.destroy(); 
            
            commentFromFile = ""; 
        },
        commit:function (dialog) {
            var results = dialog.store();
            
            var mark = results["mark"];
            var ques = results["ques"];
            var comm = results["comm"]; 
            
            var lastNumber;
            var indexOfDot;
            var skipLastValidation = false;
            var dot = mark.substring(mark.indexOf("."), mark.indexOf(".")+1);
            
            if(dot == ".") {
               indexOfDot = mark.indexOf(".");
               
               if(indexOfDot == 0) {
                  mark = "0.5";
               } else { 
                  lastNumber = mark.substring(mark.indexOf(".")+1, mark.length);
                 
                  if(lastNumber != '5') {
                     app.alert("Only decimals of .5 are allowed!");
                         
                     skipRemoveButtons = true;
                     skipLastValidation = true;
                  }
               }
            }
            
            if(!skipLastValidation) {
              var regNumber = /\D/;
              if(regNumber.test(mark) && (mark.indexOf(".") == -1) && (mark.indexOf("-") == -1)) {
                 app.alert("Only numbers are allowed!");
                 
                 skipRemoveButtons = true;
              } else
              if(mark == "") {
                 app.alert("Please enter a mark!");
                 
                 skipRemoveButtons = true;
              } else
              if(mark > 100) {
                 app.alert("You cannot enter a mark more than 100!");
                 
                 skipRemoveButtons = true;
              } else
              if(mark < -100) {
                 app.alert("You cannot enter a mark less than -100!");
                 
                 skipRemoveButtons = true;
              } else {
                 commentFromFile = comm;

                 doAnnot(aNewDoc, x, y, ques, mark, type);
              }
            }
        }, 
        description: {
            name: "Mark Data",
            align_children: "align_left",
            width: 100,
            height: 100,
            first_tab: "mark",
            elements: 
            [
              {
              type: "cluster",
              name: "Mark Setup",
              align_children: "align_left",
              elements:
                [ 
                  {
                    type: "view",
                    align_children: "align_row",
                    elements:
                    [
                      {
                        type: "static_text",
                        name: "Mark:       "
                      },
                      {
                        item_id: "mark",
                        type: "edit_text",
                        alignment: "align_fill",
                        width: 80,
                        height: 20,
                        next_tab: "ques"
                      }
                  ]
                  }, 
                  {
                    type: "view",
                    align_children: "align_row",
                    elements:
                    [
                      {
                        type: "static_text",
                        name: "Element:  "
                      },
                      {
                        item_id: "ques",
                        type: "edit_text",
                        alignment: "align_fill",
                        width: 80,
                        height: 20,
                        next_tab: "comm"
                      }
                  ]
                  },
                  {
                    type: "view",
                    align_children: "align_row",
                    elements:
                    [
                      {
                        type: "static_text",
                        name: "Comment:"
                      },
                      {
                        item_id: "comm",
                        type: "edit_text",
                        multiline: true,
                        alignment: "align_fill",
                        width: 200,
                        height: 150
                      }
                  ]
                  },
                  {
                  type: "static_text",
                  name: "Date: ",
                  
                  char_width: 25,
                  item_id: "date"
                  },
               ]
              },
              {
                  alignment: "align_left",
                  type: "ok_cancel",
                  ok_name: "Ok",
                  cancel_name: "Cancel"
              }
            ]
          }
       };

       app.endPriv();
       
       return dialog1;     
   }
);

/*
   Proudly Developed By
 
   THE AESIR DEVELOPMENT SQUAD 
   www.aesir.co.za | info@aesir.co.za | +27 11 702 9000
*/
var getMarkDialog = app.trustedFunction(
   function(aNewDoc, x, y, type) {
       app.beginPriv();
       
       var dialog1 = {
        initialize: function (dialog) {
            var todayDate = dialog.store()["date"];
            todayDate = "Date: " + util.printd("mmmm dd, yyyy", new Date());
            dialog.load({ "date": todayDate });
            
            if(labelForMark != "") {
               dialog.load({ "ques": labelForMark });
            }
        },
        destroy:function (dialog) {
            var aim_annot = aNewDoc.getAnnot({ nPage: aNewDoc.pageNum, cName: "AIM"});
            aim_annot.destroy();  
        },
        commit:function (dialog) {
            var results = dialog.store();
            
            var mark = results["mark"];
            var ques = results["ques"];  
            
            var lastNumber;
            var indexOfDot;
            var skipLastValidation = false;
            var dot = mark.substring(mark.indexOf("."), mark.indexOf(".")+1);
            
            if(dot == ".") {
               indexOfDot = mark.indexOf(".");
               
               if(indexOfDot == 0) {
                  mark = "0.5";
               } else { 
                  lastNumber = mark.substring(mark.indexOf(".")+1, mark.length);
                 
                  if(lastNumber != '5') {
                     app.alert("Only decimals of .5 are allowed!");
                         
                     skipRemoveButtons = true;
                     skipLastValidation = true;
                  }
               }
            }
            
            if(!skipLastValidation) {
              var regNumber = /\D/;
              if(regNumber.test(mark) && (mark.indexOf(".") == -1) && (mark.indexOf("-") == -1)) {
                 app.alert("Only numbers are allowed!");
                 
                 skipRemoveButtons = true;
              } else
              if(mark == "") {
                 app.alert("Please enter a mark!");
                 
                 skipRemoveButtons = true;
              } else
              if(mark > 100) {
                 app.alert("You cannot enter a mark more than 100!");
                 
                 skipRemoveButtons = true;
              } else
              if(mark < -100) {
                 app.alert("You cannot enter a mark less than -100!");
                 
                 skipRemoveButtons = true;
              } else {
                 labelForMark = ques;
              
                 doAnnot(aNewDoc, x, y, ques, mark, type);
              }
            }
        }, 
        description: {
            name: "Mark Data",
            align_children: "align_left",
            width: 100,
            height: 100,
            first_tab: "mark",
            elements: 
            [
              {
              type: "cluster",
              name: "Mark Setup",
              align_children: "align_left",
              elements:
                [ 
                  {
                    type: "view",
                    align_children: "align_row",
                    elements:
                    [
                      {
                        type: "static_text",
                        name: "Mark:    "
                      },
                      {
                        item_id: "mark",
                        type: "edit_text",
                        alignment: "align_fill",
                        width: 80,
                        height: 20,
                        next_tab: "ques",
                      }
                  ]
                  }, 
                  {
                    type: "view",
                    align_children: "align_row",
                    elements:
                    [
                      {
                        type: "static_text",
                        name: "Element:"
                      },
                      {
                        item_id: "ques",
                        type: "edit_text",
                        alignment: "align_fill",
                        width: 80,
                        height: 20
                      }
                  ]
                  },
                  {
                  type: "static_text",
                  name: "Date: ",
                  
                  char_width: 25,
                  item_id: "date"
                  },
               ]
              },
              {
                  alignment: "align_left",
                  type: "ok_cancel",
                  ok_name: "Ok",
                  cancel_name: "Cancel"
              }
            ]
          }
       };

       app.endPriv();
       
       return dialog1;     
   }
);

var getTickMarkDialog = app.trustedFunction(
   function(aNewDoc) {
       app.beginPriv();
       
       var cancelTickMark = true;
       
       var dialog1 = {
        initialize: function (dialog) {
            var todayDate = dialog.store()["date"];
            todayDate = "Date: " + util.printd("mmmm dd, yyyy", new Date());
            dialog.load({ "date": todayDate });
            dialog.load({ "mark": "1" });
        },
        destroy:function (dialog) {
            removeContinuesMarking(aNewDoc);
        },
        commit:function (dialog) {
            var results = dialog.store();
            
            var mark = results["mark"];
            
            if(mark == "") {
               mark = 1;
            }
            
            var regNumber = /\D/;
            if(regNumber.test(mark)) {
               cancelTickMark = true;
               
               app.alert("Only numbers are allowed!");
            } else
            if(mark > 100) {
               cancelTickMark = true;
               
               app.alert("Mark for tick cannot be greater than 100!");
            } else
            if(mark < 0) {
               cancelTickMark = true;
               
               app.alert("Mark for tick cannot be less than 0!");
            } else {
               currentMarkForTick = mark;
               
               cancelTickMark = false;
            }
        }, 
        description: {
            name: "Mark Data",
            align_children: "align_left",
            width: 100,
            height: 100,
            first_tab: "mark",
            elements: 
            [
              {
              type: "cluster",
              name: "Mark Setup",
              align_children: "align_left",
              elements:
                [
                  {
                    type: "view",
                    align_children: "align_row",
                    elements:
                    [
                      {
                        type: "static_text",
                        name: "Mark for Tick:"
                      },
                      {
                        item_id: "mark",
                        type: "edit_text",
                        alignment: "align_fill",
                        width: 80,
                        height: 20
                      }
                  ]
                  },
                  {
                  type: "static_text",
                  name: "Date: ",
                  
                  char_width: 25,
                  item_id: "date"
                  },
               ]
              },
              {
                  alignment: "align_left",
                  type: "ok_cancel",
                  ok_name: "Ok",
                  cancel_name: "Cancel"
              }
            ]
          }
       };
       
       app.execDialog(dialog1);
       app.endPriv();
       
       return cancelTickMark;
   }
);

/*
   Proudly Developed By
 
   THE AESIR DEVELOPMENT SQUAD 
   www.aesir.co.za | info@aesir.co.za | +27 11 702 9000
*/
var getTotalDialog = app.trustedFunction(
   function(aNewDoc) {
       app.beginPriv();
       
       var skipTotalCount = true;
       
       if(assigmentTotal != -1) {
          skipTotalCount = false;
       }
       
       var dialog1 = {
        initialize: function (dialog) {
            var todayDate = dialog.store()["date"];
            todayDate = "Date: " + util.printd("mmmm dd, yyyy", new Date());
            dialog.load({ "date": todayDate });
            
            var arrFileData = readCommentTextFile(aNewDoc, "TOT_ENGINE");
            
            var totalFromFile = 0;
            if(arrFileData[1] == "</empty>") {
               totalFromFile = "";
            } else {
               totalFromFile = parseInt(arrFileData[1]);
            }
            dialog.load({ "totl": (""+totalFromFile) });
        },
        commit:function (dialog) {
            var results = dialog.store();
            
            var total = results["totl"];  
            
            var regNumber = /\D/;
            if(regNumber.test(total)) {
               skipTotalCount = true;
               
               app.alert("Only numbers are allowed!");
            } else
            if(total == null) {
               skipTotalCount = true;
            } else
            if(total > 999) {
               skipTotalCount = true;
               
               app.alert("Total cannot be greater than 999!");
            } else
            if(total <= 0) {
               skipTotalCount = true;
               
               app.alert("Total cannot be 0 or less than 0!");
            } else {
               assigmentTotal = total;  
               
               skipTotalCount = false;
            }
        }, 
        description: {
            name: "Result Data",
            align_children: "align_left",
            width: 100,
            height: 100,
            first_tab: "totl",
            elements: 
            [
              {
              type: "cluster",
              name: "Result Setup",
              align_children: "align_left",
              elements:
                [
                  {
                    type: "view",
                    align_children: "align_row",
                    elements:
                    [
                      {
                        type: "static_text",
                        name: "Total:       "
                      },
                      {
                        item_id: "totl",
                        type: "edit_text",
                        alignment: "align_fill",
                        width: 80,
                        height: 20
                      }
                  ]
                  },
                  {
                  type: "static_text",
                  name: "Date: ",
                  
                  char_width: 25,
                  item_id: "date"
                  },
               ]
              },
              {
                  alignment: "align_left",
                  type: "ok_cancel",
                  ok_name: "Ok",
                  cancel_name: "Cancel"
              }
            ]
          }
       };

       app.execDialog(dialog1);
       app.endPriv();
       
       return skipTotalCount;     
   }
);

/*
   Proudly Developed By
 
   THE AESIR DEVELOPMENT SQUAD 
   www.aesir.co.za | info@aesir.co.za | +27 11 702 9000
*/
var addMarkingButtons = app.trustedFunction(
  function(aNewDoc, type) {
      app.beginPriv();
      
      var annotButton;
      var copy_annot_btn;
      var numpages = aNewDoc.numPages;
      
      var coords = [];
      for (var i=0; i < numpages; i++) {
          var pageSizeBox = aNewDoc.getPageBox("Media", i);
          
          annotButton = ({
             cName: "btn" + i,
             cFieldType: "button",
             nPageNum: i,
             oCoords: pageSizeBox
          });
          
          copy_annot_btn = aNewDoc.addField(annotButton);
          
          if(type == "COMMENTM") {
             copy_annot_btn.setAction("MouseUp", "doMark(aNewDoc, 'COMMENTM')");
          } else
          if(type == "MARK") {
             copy_annot_btn.setAction("MouseUp", "doMark(aNewDoc, 'MARK')");
          } else
          if(type == "TICK") {
             copy_annot_btn.setAction("MouseUp", "doMark(aNewDoc, 'TICK')");
          } else
          if(type == "CROSS") {
             copy_annot_btn.setAction("MouseUp", "doMark(aNewDoc, 'CROSS')");
          } else
          if(type == "CHECK") {
             copy_annot_btn.setAction("MouseUp", "doMark(aNewDoc, 'CHECK')");
          } else
          if(type == "HALFT") {
             copy_annot_btn.setAction("MouseUp", "doMark(aNewDoc, 'HALFT')");
          }
          
          copy_annot_btn.highlight = highlight.n;

      }
      
      app.endPriv();
  }
);

var removeMarkingButtons = app.trustedFunction(
  function(aNewDoc) {
      app.beginPriv();
      
      var numpages = aNewDoc.numPages;

      for (var i=0; i < numpages; i++) {      
        aNewDoc.removeField("btn" + i);
      }
      
      app.endPriv();
  }
);

/*
   Proudly Developed By
 
   THE AESIR DEVELOPMENT SQUAD 
   www.aesir.co.za | info@aesir.co.za | +27 11 702 9000
*/
var countMarks = app.trustedFunction(
  function(aNewDoc) {
     app.beginPriv();
     
     if(firstInitialization) {
        try {
          var edtSpecial = aNewDoc.getField("ResultPage");
         
          resultsPageNumber = edtSpecial.page;
        } catch(Error) {}
       
        firstInitialization = false;
     }
     
     if(resultsPageNumber != -1) {
        aNewDoc.deletePages(resultsPageNumber);
         
        resultsPageNumber = -1;
     }
     
     removeContinuesMarking(aNewDoc);

     var countMark = 0;
     var countTick = 0;
     var countCross = 0;
     var countHalfTick = 0;
     var countCommentMark = 0;
     
     var arrAnnotMark = new Array();
     var arrAnnotTick = new Array();    
     var arrAnnotCross = new Array();
     var arrAnnotHalfTick = new Array();
     var arrAnnotCommentMark = new Array();
     
     var annots = aNewDoc.getAnnots();
     if(annots != null) {
       for(var i = 0; i < annots.length; i++) {
          var annot_data = annots[i].subject;
          
          var annot_type = "";
          try {
             annot_type = annot_data.indexOf("COMMENTM");
             
             if(annot_type == 0) {
                arrAnnotCommentMark[countCommentMark] = annot_data;
                
                countCommentMark++;
             }
          } catch(Error) {}
          try {
             annot_type = annot_data.indexOf("MARK");
             
             if(annot_type == 0) {
                arrAnnotMark[countMark] = annot_data;
                
                countMark++;
             }
          } catch(Error) {}
          try {
             annot_type = annot_data.indexOf("TICK");
             
             if(annot_type == 0) {
                arrAnnotTick[countTick] = annot_data;
                
                countTick++;
             }
          } catch(Error) {}
          try {
             annot_type = annot_data.indexOf("HALFT");
             
             if(annot_type == 0) {
                arrAnnotHalfTick[countHalfTick] = annot_data;
                
                countHalfTick++;
             }
          } catch(Error) {}
          try {
             annot_type = annot_data.indexOf("CROSS");
             
             if(annot_type == 0) {
                arrAnnotCross[countCross] = annot_data;
                
                countCross++;
             }
          } catch(Error) {}    
       }
       
       var arrMarkM = [];
       var arrMarkQM = [];
       var quesMarkCount = 0;
       var markMarkCount = 0;
       var tempQuestion = "";
       for(var i = 0; i < arrAnnotMark.length; i++) {
           var mark_data = arrAnnotMark[i];
           
           var question = mark_data.substring(mark_data.indexOf(":")+1, mark_data.indexOf("|"));
           var mark = mark_data.substring(mark_data.indexOf("|")+1, mark_data.length);
           
           if(question == "MARK " || question == "  ") {
              arrMarkM[markMarkCount] = mark;
              markMarkCount++;
           } else {
              arrMarkQM[quesMarkCount] = [question, mark];
              quesMarkCount++;
           }
       }
       
       var arrTempMarkQM = [];
       var countTheSame = 0;
       for(var i = 0; i < arrMarkQM.length; i++) {
           var question = arrMarkQM[i][0];
           var mark = arrMarkQM[i][1];
           
           var notTheSame = true;
           for(var j = 0; j < arrTempMarkQM.length; j++) {
               if(question == arrTempMarkQM[j][0]) {
                  var addSameMark = parseFloat(arrTempMarkQM[j][1])+parseFloat(mark);
                  arrTempMarkQM[j] = [question, addSameMark];
                  notTheSame = false;
                  break;
               }
               
               countTheSame = j+1;
           }
           
           if(notTheSame) {
              arrTempMarkQM[countTheSame] = [question, mark]; 
           } 
       }
       arrMarkQM = arrTempMarkQM;
       
       var arrTickQM = [];
       for(var i = 0; i < arrAnnotTick.length; i++) {
           var mark_data = arrAnnotTick[i];
           
           var question_mark = mark_data.substring(mark_data.indexOf("|")+1, mark_data.length);

           arrTickQM[i] = question_mark;
       }
       
       var arrHalfTickQM = [];
       for(var i = 0; i < arrAnnotHalfTick.length; i++) {
           var mark_data = arrAnnotHalfTick[i];
           
           var question_mark = mark_data.substring(mark_data.indexOf("|")+1, mark_data.length);

           arrHalfTickQM[i] = question_mark;
       }
       
       var arrCrossQM = [];
       for(var i = 0; i < arrAnnotCross.length; i++) {
           var mark_data = arrAnnotCross[i];
           
           var question_mark = mark_data.substring(mark_data.indexOf("|")+1, mark_data.length);

           arrCrossQM[i] = question_mark;
       }

       skipTotalDialog = false;
       var skipAll = false;
       if(hasRubricAttached) {
           var choice = app.alert("Does this Assignment have a Rubric?", 1, 2);
      
           if(choice == 4) {

              hasRubricAttached = aNewDoc.importDataObject({
                 cName: "RUBRIC_FORM",
                 cDIPath: currentRubricOpened
              }); 
              
              var attachedRubic = aNewDoc.openDataObject("RUBRIC_FORM");
              attachedRubricMark = new String(attachedRubic.title);
              
              if(attachedRubricMark.length == 3) {
                 attachedRubricMark = "000" + attachedRubricMark;
              } else
              if(attachedRubricMark.length == 4) {
                 attachedRubricMark = "00" + attachedRubricMark;
              } else
              if(attachedRubricMark.length == 5) {
                 attachedRubricMark = "0" + attachedRubricMark;
              } else {
                 
                 if(attachedRubricMark.length == 6) {
                    var val1 = parseInt(attachedRubricMark.substring(0, 3));
                    var val2 = parseInt(attachedRubricMark.substring(3, 6));
                    
                    if(val1 > val2) {
                       app.alert("This Rubric has not been finalized!\n" +
                                 "Please ensure that the Rubric has been finalized and saved!");
                   
                       skipAll = true; 
                    }
                 } else {
                    app.alert("This Rubric has not been finalized!\n" +
                             "Please ensure that the Rubric has been finalized and saved!");
                   
                    skipAll = true;
                 }
              }
              
              var regNumber = /\D/;
              if(regNumber.test(attachedRubricMark)) {
                 app.alert("This Rubric is not finalized!\n" +
                           "Please ensure that the Rubric has been finalized and saved!");

                 skipAll = true;
              }
              
              if(!skipAll) {
                var docFileName = aNewDoc.documentFileName;
                var fileName = docFileName.substring(0, docFileName.indexOf('.'));
                
                var newRubricPath = "/@resourcesDIR@/Rubrics/" + fileName + "_MARK" + attachedRubricMark + "_RUBRIC.pdf";
                attachedRubic.saveAs({
                   cPath: newRubricPath 
                });
                
                aNewDoc.removeDataObject("RUBRIC_FORM");
                
                aNewDoc.importDataObject({
                   cName: "RUBRIC_FORM",
                   cDIPath: newRubricPath
                });
                
                assigmentTotal = parseInt(attachedRubricMark.substring(3, 6));
                totalMarks = parseFloat(attachedRubricMark.substring(0, 3));

                skipTotalDialog = true;
              } else {
                aNewDoc.removeDataObject("RUBRIC_FORM");
              }
           } 
       }
       
       if(!skipAll) {
         if(!skipTotalDialog) {
            skipBiuld = getTotalDialog(aNewDoc);
         } else {
            skipBiuld = false;
         }
         
         if(!skipBiuld) {
            biuldResultsPage(aNewDoc, arrMarkM, arrMarkQM, arrTickQM, arrHalfTickQM, arrCrossQM);
         }
       }
     } else {
       app.alert("There are no marks to calculate!");
     }
     
     app.endPriv();
  }
);

var addBlankPage = app.trustedFunction(
  function(aNewDoc) {
     app.beginPriv();
     
     var newPageNum = -1;
     
     aNewDoc.insertPages({
       nPage: aNewDoc.numPages-1,
       cPath: "/@resourcesDIR@/BlankSheet.pdf",
       nStart: 0
     });
     
     newPageNum = aNewDoc.numPages-1;
     
     app.endPriv();
     
     return newPageNum;
  }
);

/*
   Proudly Developed By
 
   THE AESIR DEVELOPMENT SQUAD 
   www.aesir.co.za | info@aesir.co.za | +27 11 702 9000
*/
var biuldResultsPage = app.trustedFunction(
  function(aNewDoc, arrMMark, arrQMark, arrTick, arrHalfTick, arrCross) {
     app.beginPriv();
     
     if(!skipTotalDialog) {
        totalMarks = 0;
     }
     
     resultsPageNumber = addBlankPage(aNewDoc);
     
     var aRect = [0, 612,792,0];
    
     var y = 5;
     var h = 80;
    
     var lx = 5;
     var ly = aRect[2] - y; 
     var rx = aRect[1] - 20;
     var ry = aRect[2] - h;
     
     var countQuestionMark = 0;
     for(var i = 0; i < arrQMark.length; i++) {
         countQuestionMark += parseFloat(arrQMark[i][1]);
     }
     
     var countMarkMarks = 0;
     for(var i = 0; i < arrMMark.length; i++) {
         countMarkMarks += (parseFloat(arrMMark[i]));
     }
     
     var countTickMarks = 0;
     for(var i = 0; i < arrTick.length; i++) {
         countTickMarks += parseInt(arrTick[i]);
     }
     
     var countHalfMarks = 0;
     for(var i = 0; i < arrHalfTick.length; i++) {
         countHalfMarks += (parseFloat(arrHalfTick[i]));
     }
     
     if(!skipTotalDialog) {
        totalMarks = (countQuestionMark + countMarkMarks + countTickMarks + countHalfMarks);
     }
     
     if(totalMarks > assigmentTotal) {
        app.alert("You have entered a total that is less then the given marks!", 1);
     }

     var edtSpecial = aNewDoc.addField("ResultPage", "text", resultsPageNumber, [0, 0, 0, 0]);
     edtSpecial.hidden = true;
     
     var edtFinish = aNewDoc.addField("edtFinish", "text", resultsPageNumber, [0, 0, 0, 0]);
     edtFinish.hidden = true;
     
     var btnFinish = aNewDoc.addField("btnFinish", "button", resultsPageNumber, [5, 5, 70, 30]);
     btnFinish.buttonSetCaption("Finalize");
     btnFinish.setAction("MouseUp", "finalizePDF(aNewDoc)");
     btnFinish.borderStyle = border.b;
     btnFinish.display = display.noPrint;
     btnFinish.highlight = "push";
     btnFinish.lineWidth = 2;

     var edtHeader = aNewDoc.addField("edtResultHeader", "text", resultsPageNumber, [lx, ly, rx, ry]);
     edtHeader.value = "             RESULTS";
     edtHeader.readonly = true;
    
     y += 85;
     h += 30;
     ly = aRect[2] - y;
     ry = aRect[2] - h;
     
     var showTotalLine = false;
     
     if(!skipTotalDialog) {
       for(var i = 0; i < arrQMark.length; i++) {
           var edtMarkResult = aNewDoc.addField("edtMarkResult" + i, "text", resultsPageNumber, [lx, ly, rx, ry]);
           edtMarkResult.value = arrQMark[i][0] + " = " + arrQMark[i][1];
           
           edtMarkResult.readonly = true;
   
           y += 30;
           h += 30;
           ly = aRect[2] - y;
           ry = aRect[2] - h;
           
           showTotalLine = true;
       }
       
       var totalMarkMarks = parseFloat(countMarkMarks + countTickMarks + countHalfMarks);
       if(countQuestionMark > 0 && totalMarkMarks > 0) {
         var edtHeader2 = aNewDoc.addField("edtMMarks", "text", resultsPageNumber, [lx, ly, rx, ry]);
         edtHeader2.value = "No Elements = " + totalMarkMarks;       

         edtHeader2.readonly = true;
         
         y += 30;
         h += 30;
         ly = aRect[2] - y;
         ry = aRect[2] - h;
         
         showTotalLine = true;
       }
       
       if(showTotalLine) {
         var edtHeader = aNewDoc.addField("edtTotalScore", "text", resultsPageNumber, [lx, ly, rx, ry]);
         edtHeader.value = "------------------------------";
         edtHeader.readonly = true;
       }
       
       y += 30;
       h += 30;
       ly = aRect[2] - y;
       ry = aRect[2] - h;
     }
     
     if(!skipTotalDialog) {
       var percentage = Math.round((totalMarks/assigmentTotal)*100);
       var edtHeader = aNewDoc.addField("edtTotal", "text", resultsPageNumber, [lx, ly, rx, ry]);
       edtHeader.value = "Total = " + totalMarks + " / " + assigmentTotal + "  (" + percentage + "%)";
       edtHeader.readonly = true;
     } else {
       var edtHeader = aNewDoc.addField("edtTotal", "text", resultsPageNumber, [lx, ly, rx, ry]);
       edtHeader.value = "Total = " + totalMarks + " / " + assigmentTotal + "  (" + totalMarks + "%)";
       edtHeader.readonly = true;
     }
     
     app.endPriv();
  }
);

var readCommentTextFile = app.trustedFunction(
  function(aNewDoc, type) {
      app.beginPriv();
      
      var filepath = "";
      if(type == "COMM_ENGINE") {
         filepath = "/@resourcesDIR@/comm_engine.txt";
      } else
      if(type == "TOT_ENGINE") {
         filepath = "/@resourcesDIR@/tot_engine.txt";
      } else
      if(type == "RUBRIC_ENGINE") {
         filepath = "/@resourcesDIR@/rubric_engine.txt";
      }
      
      try {
        var textArray = ["BOF"];
        
        var field = aNewDoc.addField("BOF","text",aNewDoc.pageNum,[0,0,0,0]);
        for(var i = 0; field.value != "EOF"; i++) {
            aNewDoc.importTextData(filepath,i);
            textArray.push(field.value);
        }
        
        aNewDoc.removeField("BOF");
      } catch(Error) {
        app.alert("There is no comment saved to file!", 1);
      }
      
      app.endPriv();
                      
      return textArray;
  }
);

/*
   Proudly Developed By
 
   THE AESIR DEVELOPMENT SQUAD 
   www.aesir.co.za | info@aesir.co.za | +27 11 702 9000
*/
var finalizePDF = app.trustedFunction(
  function(aNewDoc, marks, total) {
      app.beginPriv();
      
      var edtFinish = aNewDoc.getField("edtFinish");
      
      if(edtFinish.value == "") {
         
        var docFileName = aNewDoc.documentFileName;
        var fileName = docFileName.substring(0, docFileName.indexOf('.'));
        var percentage = Math.round((totalMarks/assigmentTotal)*100);
        var padTotal = ""+percentage;
        var padTotalMarks = "100";
        
        if(padTotal.length == 1) {
           padTotal = "00" + padTotal;
        } else 
        if(padTotal.length == 2) {
           padTotal = "0" + padTotal;
        }
        
        if(padTotalMarks.length == 1) {
           padTotalMarks = "00" + padTotalMarks;
        } else 
        if(padTotalMarks.length == 2) {
           padTotalMarks = "0" + padTotalMarks;
        }
        
        var combinedMark = "";
        if(hasRubricAttached) {
           combinedMark = attachedRubricMark;
        } else {
           combinedMark = padTotal + "" + padTotalMarks;
        }
        
        var choice = app.alert("This document will be finalized with the name [" + fileName + "_MARK" + combinedMark + ".pdf]," + 
                                "once this document is finalized no future changes can be made to it, you will have to use the original PDF [" + fileName + ".pdf] for a remark.", 1, 2);
        
        if(choice == 4) {
          edtFinish.value = "FINAL_DONE";
          edtFinish.readonly = true;
          
          var btnFinish = aNewDoc.getField("btnFinish");
          btnFinish.display = display.hidden;
        
          app.hideToolbarButton("toolAddHalfTick");
          app.hideToolbarButton("toolAddTick");
          app.hideToolbarButton("toolAddStamp");
          app.hideToolbarButton("toolAddCross");
          app.hideToolbarButton("toolDeselect");
          app.hideToolbarButton("toolAddMark");
          app.hideToolbarButton("toolAddCommentMark");
          app.hideToolbarButton("toolAddCount");
          app.hideToolbarButton("toolVersion");
          
          aNewDoc.saveAs({
             cPath: fileName + "_MARK" + combinedMark + ".pdf" 
          });
          
          if(skipTotalDialog) {
            var btnViewRubric = aNewDoc.addField("btnViewRubric", "text", resultsPageNumber, [20, 100, 592, 20]);
            btnViewRubric.value = "To view the attached Rubric (with marking criteria, comments and marks allocation),\n" + 
                                  "please click the PaperClip Icon in the bottom left hand corner of Adobe Reader or Acrobat and open the attachment.";
            btnViewRubric.readonly = true;
            btnViewRubric.textSize = 16;
            btnViewRubric.multiline = true;
            btnViewRubric.display = display.noPrint;
            
            rubricDoc.closeDoc();
          }
          
          aNewDoc.removeField("btnOpenRubric");
          
          var annots = aNewDoc.getAnnots();
          var hasCommentsToBiuld = false;
          for(var i in annots) {
              if(annots[i].contents != "") {
                 hasCommentsToBiuld = true;
              }  
          }
          
          if(hasCommentsToBiuld) {
             biuldCommentsPages(aNewDoc);
          }
        }
      } else {
          app.alert("This document has already been finalized!");
      }
      
      app.endPriv();
  }
);

var biuldCommentsPages = app.trustedFunction(
  function(aNewDoc) {
      var annots = aNewDoc.getAnnots({ nSortBy: ANSB_Page });
      var theAnnots = [];
      var count = 0;
      for(var i in annots) {
          if(annots[i].contents != "") {
              theAnnots[count] = annots[i];
              count++;
          }
          
          annots[i].readOnly = true;
      }
      
      var edtComment;
      var coord = [];
      var currentPageRotation = 0;
      var numCount = 1;
      
      
      var pageSizeBox = aNewDoc.getPageBox("Crop");
      var width = pageSizeBox[2] - pageSizeBox[0];
      var height = pageSizeBox[1] - pageSizeBox[3];
       
      var ae2d = [];
      
      var numberW = 10;
      var numberWdouble = 17;
      var numberH = 15;
      var shiftUp = 18;
      var shiftRight = -15;
      var twenty = 20;
      for(var i in theAnnots) {
          if(i > 8) {
             numberW = numberWdouble;
	        }
          
          currentPageRotation = aNewDoc.getPageRotation({nPage: theAnnots[i].page});
          
          coord = theAnnots[i].rect;
          
          if(currentPageRotation == 0) {
	           ae2d[0] = [coord[2], coord[3]];
             ae2d[1] = [coord[0], coord[1]];

             coord[0] = ae2d[0][0] + shiftRight;
             coord[1] = ae2d[0][1] + shiftUp;
             coord[2] = coord[0] - numberW;
             coord[3] = coord[1] - numberH;
          } else
          if(currentPageRotation == 90) {
             ae2d[0] = [coord[3], coord[2]];
             ae2d[1] = [coord[1], coord[0]];

	           coord[0] = 20 + ae2d[0][0] + shiftRight;
             coord[1] = (width+twenty) - ae2d[0][1] + shiftUp; 
             coord[2] = coord[0] - numberW;
             coord[3] = coord[1] - numberH;
          } else
          if(currentPageRotation == 180) {
             ae2d[0] = [coord[0], coord[1]];
	           
             coord[0] = ae2d[0][0] + shiftRight;
             coord[1] = (height+twenty) - ae2d[0][1] + shiftUp;
             coord[2] = coord[0] - numberW;
             coord[3] = coord[1] - numberH;
          } else
          if(currentPageRotation == 270) {
             ae2d[0] = [coord[3], coord[2]];
             
             coord[0] = (width+twenty) - ae2d[0][0] + shiftRight;
             coord[1] = ae2d[0][1] + shiftUp;
             coord[2] = coord[0] - numberW;
             coord[3] = coord[1] - numberH;
          } 
          
          edtComment = aNewDoc.addField("EDITCOMM:" + i, "text", theAnnots[i].page, coord);
          
          edtComment.value = numCount;
          edtComment.rect = coord;
          edtComment.readonly = true; 
          edtComment.borderStyle = border.s;
          edtComment.fillColor = color.white;
          edtComment.strokeColor = color.red;
          edtComment.lineWidth = 1;
          edtComment.width = 20;
          
          numCount++;
           
      }

      var startCommentPageNumber = addBlankPage(aNewDoc);
      
      var aRect = [0, 612,792,0];
    
      var y = 5;
      var h = 80;
    
      var lx = 5;
      var ly = aRect[2] - y; 
      var rx = aRect[1] - 20;
      var ry = aRect[2] - h;
      
      var edtHeader = aNewDoc.addField("edtCommentHeader", "text", startCommentPageNumber, [lx, ly, rx, ry]);
      edtHeader.value = "          COMMENTS";
      edtHeader.readonly = true;
      
      y += 85;
      h += 30;
      ly = aRect[2] - y;
      ry = aRect[2] - h;

      var maxLines = 45;
      var usedSpace = 0;
      var hasExceededPage = false;
      var tempArray = [];
      var tempArrayCount = 0;
      var commArray = [];
      var commArrayCount = 0;
      var charsInALine = 100;
      for(var i in theAnnots) {
          var text = theAnnots[i].contents;
          var lines = parseInt(parseInt(text.length) / charsInALine) + 1;
          var spaceUsed = parseInt(lines);
          
          usedSpace += spaceUsed;
          if(usedSpace < maxLines) {
             tempArray[tempArrayCount] = theAnnots[i];
             tempArrayCount++;
          } else
          if(usedSpace > maxLines) {
             hasExceededPage = true;
          }
          
          if(hasExceededPage) {
             commArray[commArrayCount] = tempArray;
             commArrayCount++;
             
             tempArray = [];
             tempArrayCount = 0;
             tempArray[tempArrayCount] = theAnnots[i];
             tempArrayCount++;
             
             usedSpace = 0;
             hasExceededPage = false;
          }
          
          if(i == theAnnots.length-1) {
             commArray[commArrayCount] = tempArray;
          }
      }
      
      var tArray = [];
      var unique = 99999;
      var commentCountNumber = 1;
      for(var i = 0; i < commArray.length; i++) {
          tArray = commArray[i];
          
          if(i != 0) {
            startCommentPageNumber = addBlankPage(aNewDoc); 
            
            y = 5;
            h = 80;
      
            lx = 5;
            ly = aRect[2] - y; 
            rx = aRect[1] - 20;
            ry = aRect[2] - h;
            
            var edtHeader = aNewDoc.addField("edtCommentHeader" + i, "text", startCommentPageNumber, [lx, ly, rx, ry]);
            edtHeader.value = "          COMMENTS";
            edtHeader.readonly = true;
          }
          
          var pageHeight = 792;
          var pageHeading = 90;
          var textHeight = 16;
          var commentHeight = 0;
          var yPositionCursor = 0;
          var numberOfLinesForComment = 0;
          var xPositionStart = 50;
          var xPositionEnd = 600;
          var yPositionStart = 0;
          var yPositionEnd = 0;
          
          for(var j = 0; j < tArray.length; j++) {
              
              var text = tArray[j].contents;
              numberOfLinesForComment = parseInt(parseInt(text.length) / charsInALine) + 1;
              
              if (j == 0) {
                yPositionCursor = pageHeight - pageHeading;
              } else {
                yPositionCursor = yPositionCursor - commentHeight;
              }
              
              commentHeight = numberOfLinesForComment * textHeight;
              
              yPositionStart = yPositionCursor;
              yPositionEnd = yPositionCursor - commentHeight;
              
              var edtCommentDesc = aNewDoc.addField("EDTCOMMENTDESCRIPTION:" + unique, "text", startCommentPageNumber, [xPositionStart, yPositionStart, xPositionEnd, yPositionEnd]);
              edtCommentDesc.value = tArray[j].contents;
              edtCommentDesc.multiline = true;
              edtCommentDesc.readonly = true;
              edtCommentDesc.strokeColor = color.black;
              edtCommentDesc.lineWidth = 1;
              edtCommentDesc.borderStyle = border.s;
              edtCommentDesc.textSize = 12;
              
              var edtCommentNumber = aNewDoc.addField("EDITCOMM:" + unique, "text", startCommentPageNumber, [xPositionStart - 20, yPositionStart, xPositionStart, yPositionStart - 20]);
              edtCommentNumber.value = commentCountNumber;
              edtCommentNumber.readonly = true; 
              edtCommentNumber.borderStyle = border.s;
              edtCommentNumber.fillColor = color.white;
              edtCommentNumber.strokeColor = color.red;
              edtCommentNumber.lineWidth = 1;
              edtCommentNumber.width = 20;
              
              unique--;
              commentCountNumber++;
          }
      }
  }
);

/*
   Proudly Developed By
 
   THE AESIR DEVELOPMENT SQUAD 
   www.aesir.co.za | info@aesir.co.za | +27 11 702 9000
*/
var openRubricForMarking = app.trustedFunction(
  function(aNewDoc) {
     app.beginPriv();
     
     var allDocs = app.activeDocs;
     var stillOpen = false;
     if(rubricDoc != null) {
       for(var i in allDocs) {
           try {
             if(allDocs[i].path == rubricDoc.path) {
                stillOpen = true;
                break;
             }
           } catch(Error) {}
       }
     }
     
     if(!stillOpen) {
         rubricDoc = null;
     }
     
     if(rubricDoc == null) {
       var arrText = readCommentTextFile(aNewDoc, "RUBRIC_ENGINE");
       var rubricFile = arrText[1];
       
       if(rubricFile != "</empty>") {
           rubricDoc = app.openDoc(rubricFile);
           
           var docFileName = aNewDoc.documentFileName;
           var fileName = docFileName.substring(0, docFileName.indexOf('.'));
           
           currentRubricOpened = "/@resourcesDIR@/Rubrics/" + fileName + "_UNMARKED_RUBRIC.pdf";
           rubricDoc.saveAs({
               cPath: currentRubricOpened 
           });
           
           hasRubricAttached = true;
       } else {
         app.alert("There is no Rubric accossiated with this Assignment, please re-specify Rubric in Comment Tool!");
       }
     } else {
       app.alert("You have already opened the Rubric!", 1);
     }
     
     app.endPriv();
  }
);

/*
   Proudly Developed By
 
   THE AESIR DEVELOPMENT SQUAD 
   www.aesir.co.za | info@aesir.co.za | +27 11 702 9000
*/
var showAboutInformation = app.trustedFunction(
  function() {
  
     app.alert("October 2009\n" +
               "UNISA eMarking Suite\n" +
               "is delivered to UNISA under the\n" +
               "FLOSS licencing regime\n" +
               "----------------------------------------------------------------------------\n" +
               "proudly developed by\n" +
               "THE AESIR DEVELOPMENT SQUAD\n" +
               "www.aesir.co.za | info@aesir.co.za | +27 11 702 9000\n" +
               "----------------------------------------------------------------------------\n" +
               "CREDITS\n" +
               "Lead Developer\t:: War Commander\t:: Kyle Bowden\n" +
               "Business Analyst\t:: Field General\t:: Willy Gadney\n" +
               "Test Squad\t:: Clean Out Crew\t:: Herman Van Wyk & Tina Kanniah\n" +
               "Dev Support\t:: Backup\t\t:: Nelson Baloyi\n" +
               "LC Designer\t:: Artillery\t:: Lentswe Morule\n" +
               "Installer\t\t:: Mobilizer\t:: Thabahla Shoko\n" +
               "Enviro & Food\t:: Crew Support\t:: Khosi Gwala\n" +
               "Architect\t\t:: Special Operations\t:: Luigi DAmico\n", 3);
  }
);