

app.module:

	import {ZTWScrollModule} from './ztw-scroll.module';
	imports:[ZTWScrollModule];

use it as follow:	
component:

`<div  ztwScrollBind>`

	<div  (leaved)='fn2($event)' (scrolled)='fn1($event)' ztwScrollControl>one</div>
	<div  (leaved)='fn2($event)' (scrolled)='fn1($event)' ztwScrollControl>two</div>	
	<div  (leaved)='fn2($event)' (scrolled)='fn1($event)' ztwScrollControl>three</div>
	
`</div>`

