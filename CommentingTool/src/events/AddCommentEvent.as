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

package events{
	import flash.events.Event;
	
	/*
	   Proudly Developed By
	 
	   THE AESIR DEVELOPMENT SQUAD 
	   www.aesir.co.za | info@aesir.co.za | +27 11 702 9000
	*/
	public class AddCommentEvent extends Event {
		public var question:String;
		public var comment:String;
		
		public function AddCommentEvent(type:String, question:String, comment:String){
			super(type);
			
			this.question = question;
			this.comment = comment;
		}

	}
}