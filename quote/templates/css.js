export function getCss(){

return (`
.container_12,
.container_16
{
	width: 92%;
	margin-left: 4%;
	margin-right: 4%;
}


.grid_1,
.grid_2,
.grid_3,
.grid_4,
.grid_5,
.grid_6,
.grid_7,
.grid_8,
.grid_9,
.grid_10,
.grid_11,
.grid_12,
.grid_13,
.grid_14,
.grid_15,
.grid_16
{
	display: inline;
	float: left;
	margin-left: 1%;
	margin-right: 1%;
}

.container_12 .grid_3,
.container_16 .grid_4
{
	width: 23%;
}

.container_12 .grid_6,
.container_16 .grid_8
{
	width: 48%;
}

.container_12 .grid_9,
.container_16 .grid_12
{
	width: 73%;
}

.container_12 .grid_12,
.container_16 .grid_16
{
	width: 98%;
}

.alpha
{
	margin-left: 0;
}

.omega
{
	margin-right: 0;
}

.container_12 .grid_1
{
	width: 6.333%;
}

.container_12 .grid_2
{
	width: 14.666%;
}

.container_12 .grid_4
{
	width: 31.333%;
}

.container_12 .grid_5
{
	width: 39.666%;
}

.container_12 .grid_7
{
	width: 56.333%;
}

.container_12 .grid_8
{
	width: 64.666%;
}

.container_12 .grid_10
{
	width: 81.333%;
}

.container_12 .grid_11
{
	width: 89.666%;
}

.container_16 .grid_1
{
	width: 4.25%;
}

.container_16 .grid_2
{
	width: 10.5%;
}

.container_16 .grid_3
{
	width: 16.75%;
}

.container_16 .grid_5
{
	width: 29.25%;
}

.container_16 .grid_6
{
	width: 35.5%;
}

.container_16 .grid_7
{
	width: 41.75%;
}

.container_16 .grid_9
{
	width: 54.25%;
}

.container_16 .grid_10
{
	width: 60.5%;
}

.container_16 .grid_11
{
	width: 66.75%;
}

.container_16 .grid_13
{
	width: 79.25%;
}

.container_16 .grid_14
{
	width: 85.5%;
}

.container_16 .grid_15
{
	width: 91.75%;
}

.container_12 .prefix_3,
.container_16 .prefix_4
{
	padding-left: 25%;
}

.container_12 .prefix_6,
.container_16 .prefix_8
{
	padding-left: 50%;
}

.container_12 .prefix_9,
.container_16 .prefix_12
{
	padding-left: 75%;
}

.container_12 .prefix_1
{
	padding-left: 8.333%;
}

.container_12 .prefix_2
{
	padding-left: 16.666%;
}

.container_12 .prefix_4
{
	padding-left: 33.333%;
}

.container_12 .prefix_5
{
	padding-left: 41.666%;
}

.container_12 .prefix_7
{
	padding-left: 58.333%;
}

.container_12 .prefix_8
{
	padding-left: 66.666%;
}

.container_12 .prefix_10
{
	padding-left: 83.333%;
}

.container_12 .prefix_11
{
	padding-left: 91.666%;
}

.container_16 .prefix_1
{
	padding-left: 6.25%;
}

.container_16 .prefix_2
{
	padding-left: 12.5%;
}

.container_16 .prefix_3
{
	padding-left: 18.75%;
}

.container_16 .prefix_5
{
	padding-left: 31.25%;
}

.container_16 .prefix_6
{
	padding-left: 37.5%;
}

.container_16 .prefix_7
{
	padding-left: 43.75%;
}

.container_16 .prefix_9
{
	padding-left: 56.25%;
}

.container_16 .prefix_10
{
	padding-left: 62.5%;
}

.container_16 .prefix_11
{
	padding-left: 68.75%;
}

.container_16 .prefix_13
{
	padding-left: 81.25%;
}

.container_16 .prefix_14
{
	padding-left: 87.5%;
}

.container_16 .prefix_15
{
	padding-left: 93.75%;
}

.container_12 .suffix_3,
.container_16 .suffix_4
{
	padding-right: 25%;
}

.container_12 .suffix_6,
.container_16 .suffix_8
{
	padding-right: 50%;
}

.container_12 .suffix_9,
.container_16 .suffix_12
{
	padding-right: 75%;
}

.container_12 .suffix_1
{
	padding-right: 8.333%;
}

.container_12 .suffix_2
{
	padding-right: 16.666%;
}

.container_12 .suffix_4
{
	padding-right: 33.333%;
}

.container_12 .suffix_5
{
	padding-right: 41.666%;
}

.container_12 .suffix_7
{
	padding-right: 58.333%;
}

.container_12 .suffix_8
{
	padding-right: 66.666%;
}

.container_12 .suffix_10
{
	padding-right: 83.333%;
}

.container_12 .suffix_11
{
	padding-right: 91.666%;
}

.container_16 .suffix_1
{
	padding-right: 6.25%;
}

.container_16 .suffix_2
{
	padding-right: 16.5%;
}

.container_16 .suffix_3
{
	padding-right: 18.75%;
}

.container_16 .suffix_5
{
	padding-right: 31.25%;
}

.container_16 .suffix_6
{
	padding-right: 37.5%;
}

.container_16 .suffix_7
{
	padding-right: 43.75%;
}

.container_16 .suffix_9
{
	padding-right: 56.25%;
}

.container_16 .suffix_10
{
	padding-right: 62.5%;
}

.container_16 .suffix_11
{
	padding-right: 68.75%;
}

.container_16 .suffix_13
{
	padding-right: 81.25%;
}

.container_16 .suffix_14
{
	padding-right: 87.5%;
}

.container_16 .suffix_15
{
	padding-right: 93.75%;
}

html body * span.clear,
html body * div.clear,
html body * li.clear,
html body * dd.clear
{
	background: none;
	border: 0;
	clear: both;
	display: block;
	float: none;
	font-size: 0;
	list-style: none;
	margin: 0;
	padding: 0;
	overflow: hidden;
	visibility: hidden;
	width: 0;
	height: 0;
}


.clearfix:after
{
	clear: both;
	content: '.';
	display: block;
	visibility: hidden;
	height: 0;
}

.clearfix
{
	display: inline-block;
}

* html .clearfix
{
	height: 1%;
}

.clearfix
{
	display: block;
}
`
);
}
