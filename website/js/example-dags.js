/* DAGitty - a browser-based software for causal modelling and analysis
   Copyright (C) 2010, 2017, 2022 Johannes Textor

   This program is free software; you can redistribute it and/or
   modify it under the terms of the GNU General Public License
   as published by the Free Software Foundation; either version 2
   of the License, or (at your option) any later version.

   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.

   You should have received a copy of the GNU General Public License
   along with this program; if not, write to the Free Software
   Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA. */


// if the module has no dependencies, the above pattern can be simplified to
(function (root, factory) {
	if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.examples = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
	return [ 
{
	d : `bb="-3,-0.5,2,1.2"
	D [outcome,pos="1,1"]
	E [exposure,pos="-2,1"]
	Z [pos="-0.5,0.5"]
	D <-> Z [pos="1,-1"]
	E -> D
	E <-> Z [pos="-2,-1"]`,

	l: "The M-bias graph"
},

{
	d: `A [pos="-2.200,-1.520"]
	B [pos="1.400,-1.460"]
	D [outcome,pos="1.400,1.621"]
	E [exposure,pos="-2.200,1.597"]
	Z [pos="-0.300,-0.082"]
	A -> { E Z }
	B -> { D Z }
	E -> D
	Z -> { D E }`,
    l: "Extended confounding triangle"
},

{
   e: "Z X I\nX I Y\nI Y",
   v: "X E @-1.193,1.639\n"+
"Y O @1.053,1.639\n"+
"Z 1 @-0.132,-0.374\n"+
"I 1 @0.423,0.755",
   l: "Small model with mediator"
},

{
  v : "E E @-3.728,5.092\n"+
"D O @-1.510,6.789\n"+
"1 1 @-5.600,2.115\n"+
"2 1 @-7.120,-0.603\n"+
"3 1 @-7.138,-3.731\n"+
"4 1 @-5.395,-6.348\n"+
"5 1 @-2.468,-6.074\n"+
"6 1 @-2.179,-2.682\n"+
"7 1 @-1.049,-0.238\n"+
"8 1 @1.043,0.916\n"+
"9 1 @2.654,-2.614\n"+
"10 1 @4.955,-4.447\n"+
"11 1 @7.152,-1.901\n"+
"12 1 @7.424,1.256\n"+
"13 1 @5.971,3.498\n"+
"14 1 @4.225,5.936\n"+
"15 1 @1.634,7.468",
  e : "1 E\n"+
"2 1\n"+
"3 2\n"+
"4 3\n"+
"5 4\n"+
"6 5\n"+
"7 6 E\n"+
"8 7 D\n"+
"9 8\n"+
"10 9\n"+
"11 10\n"+
"12 11\n"+
"13 12\n"+
"14 13\n"+
"15 14 D\n"+
"D\n"+
"E D",
l: "Many variables but few paths"
},

 {
   v : "EDN1.3 E @-2.643,16.642\n"+
"EDNI1.7 O @-1.234,18.664\n"+
"SELP.22 1 @-0.481,2.644\n"+
"SELP.17 1 @-1.367,3.939\n"+
"ECE1.13 1 @-0.280,7.260\n"+
"ECE1.12 1 @1.202,8.772\n"+
"MET.6 1 @3.562,11.155\n"+
"CAT 1 @4.501,12.816\n"+
"CSF2.3 1 @2.509,-8.195\n"+
"CSF2.4 1 @-1.283,-8.195\n"+
"TGFBR3.10 1 @2.902,-3.702\n"+
"TGFBR3.2 1 @1.355,-2.058\n"+
"TGFBR3.8 1 @-0.092,-5.524\n"+
"SELP.12 1 @3.144,5.234\n"+
"BMP6.13 1 @-3.207,-4.786\n"+
"BMP6.12 1 @-2.382,-7.072\n"+
"ANXA2.8 1 @3.987,20.108\n"+
"BMP6.11 1 @-1.179,-0.789\n"+
"ADCY9.8 1 @2.198,9.855\n"+
"BMP6.10 1 @-3.086,2.250\n"+
"BMP6 1 @-1.985,4.558\n"+
"ANXA2.11 1 @0.105,12.599\n"+
"ANXA2.13 1 @1.437,15.415\n"+
"MET.5 1 @4.320,3.489\n"+
"BMP6.9 1 @-2.416,-2.349\n"+
"ANXA2.7 1 @-1.418,9.206\n"+
"BMP6.14 1 @-4.254,-6.607\n"+
"TGFBR3.7 1 @4.445,-7.336\n"+
"ANXA2.12 1 @-1.329,13.465\n"+
"SELP.14 1 @3.655,-1.126\n"+
"Stroke 1 @1.418,3.285\n"+
"ANXA2.5 1 @-3.410,11.227\n"+
"TGFBR3.9 1 @1.494,-6.462\n"+
"EDNI1.6 1 @1.697,21.769\n"+
"EDN1.9 1 @-4.064,21.051\n"+
"EDN1.10 1 @-0.282,22.274", 

e : "SELP.22\n"+
"SELP.17 SELP.22\n"+
"ECE1.13 SELP.17\n"+
"ECE1.12 ECE1.13\n"+
"MET.6 SELP.12\n"+
"CAT MET.5\n"+
"CSF2.3 CSF2.4\n"+
"CSF2.4\n"+
"TGFBR3.10 TGFBR3.2 TGFBR3.9\n"+
"TGFBR3.2 TGFBR3.9\n"+
"TGFBR3.8 TGFBR3.2 TGFBR3.9\n"+
"SELP.12\n"+
"EDN1.3 ANXA2.12 EDNI1.7\n"+
"BMP6.13 BMP6.12 BMP6.9\n"+
"BMP6.12\n"+
"EDN1.10 EDNI1.7\n"+
"EDNI1.6 EDN1.10 EDNI1.7\n"+
"EDNI1.7\n"+
"ANXA2.8 EDN1.3 CAT ECE1.12 EDNI1.6 ADCY9.8 BMP6 ANXA2.13\n"+
"BMP6.11 BMP6.9\n"+
"ADCY9.8\n"+
"BMP6.10 BMP6.11 BMP6.13\n"+
"BMP6 BMP6.10\n"+
"ANXA2.11\n"+
"ANXA2.13 ANXA2.11\n"+
"MET.5 MET.6 TGFBR3.7 SELP.14\n"+
"BMP6.9\n"+
"EDN1.9 EDN1.10 BMP6.14 EDN1.3\n"+
"ANXA2.7 ANXA2.11 ANXA2.5\n"+
"BMP6.14 BMP6.12\n"+
"TGFBR3.7 CSF2.3 TGFBR3.10\n"+
"ANXA2.12 ANXA2.13 ANXA2.11 ANXA2.7 ANXA2.5\n"+
"SELP.14\n"+
"Stroke CSF2.4 TGFBR3.10 MET.6 SELP.12 SELP.22 ECE1.13 ECE1.12 BMP6.12 BMP6.13 BMP6.11 ADCY9.8 BMP6.10 TGFBR3.8 MET.5 SELP.14\n"+
"TGFBR3.9\n"+
"ANXA2.5",

l: "Sebastiani et al., 2005"

},

{
    e: "0  1  0  0  0  0  0  0  0  0  0  0  0  0\n"+
       "0  0  0  0  0  0  0  0  0  0  0  0  0  0\n"+
       "1  0  0  0  0  0  0  0  0  0  0  0  0  0\n"+
       "1  0  0  0  0  0  0  0  0  0  0  0  0  0\n"+
       "0  1  1  0  0  0  1  0  0  0  0  0  0  1\n"+
       "0  1  1  0  1  0  1  0  0  0  0  0  0  1\n"+
       "0  1  0  0  0  0  0  0  0  0  0  0  0  0\n"+
       "1  1  1  1  1  1  1  0  0  0  1  1  1  1\n"+
       "1  1  1  1  1  1  1  1  0  0  1  1  1  1\n"+
       "1  1  1  1  1  1  1  1  0  0  1  1  1  1\n"+
       "1  1  0  0  1  1  1  0  0  0  0  1  0  1\n"+
       "1  1  1  0  1  1  1  0  0  0  0  0  1  0\n"+
       "0  1  1  0  1  1  1  0  0  0  0  0  0  1\n"+
       "0  1  0  0  0  0  0  0  0  0  0  0  0  0",

    v: "ToothLoss E @-1.677,2.421\n"+
"Mortality O @1.900,2.360\n"+
"Periodontitis 1 @-0.335,1.703\n"+
"Caries 1 @-1.879,-1.875\n"+
"Diabetes 1 @-0.888,0.322\n"+
"Obesity 1 @-0.904,-1.340\n"+
"Hypertension 1 @1.780,-0.157\n"+
"Psychosocial 1 @-0.088,0.266\n"+
"Age 1 @-0.039,-1.762\n"+
"Sex 1 @-0.844,-3.340\n"+
"Alcohol 1 @0.054,-3.594\n"+
"Smoking 1 @0.772,0.379\n"+
"Sport 1 @0.914,-3.396\n"+
"Lipids 1 @2.026,-1.650",

    l: "Polzer et al., 2012"
},

{
   e: "A S PA WC U TT\n"+
      "S TT T2DM\n"+
      "WC TT U T2DM\n"+
      "U TT T2DM\n"+
      "PA WC T2DM\n",
   v: "TT E @-0.443,-0.942\n"+
"T2DM O @1.666,2.693\n"+
"A 1 @-1.429,-2.311\n"+
"S 1 @-1.423,2.555\n"+
"WC 1 @0.829,-0.735\n"+
"U 1 @-0.459,1.159\n"+
"PA 1 @1.661,-2.186", 
   l: "Schipf et al., 2010"
},

{
   e: "Coach FitnessLevel TeamMotivation\n"+
"Genetics FitnessLevel NeuromuscularFatigue ConnectiveTissueDisorder\n"+
"TeamMotivation PreviousInjury WarmUpExercises\n"+
"PreGameProprioception WarmUpExercises\n"+
"ConnectiveTissueDisorder TissueWeakness NeuromuscularFatigue\n"+
"ContactSport IntraGameProprioception PreviousInjury\n"+
"TissueWeakness Injury\n"+
"IntraGameProprioception Injury\n"+
"FitnessLevel PreGameProprioception NeuromuscularFatigue\n"+
"NeuromuscularFatigue IntraGameProprioception Injury\n"+
"WarmUpExercises IntraGameProprioception",
   v: "WarmUpExercises E @-7,8.650\n"+
"Injury O @4.969,8.605\n"+
"Coach 1 @-4.392,-7.906\n"+
"Genetics 1 @2.022,-7.906\n"+
"TeamMotivation 1 @-7.175,-0.950\n"+
"PreGameProprioception 1 @-3.638,-1.235\n"+
"ConnectiveTissueDisorder 1 @3.494,-5.099\n"+
"PreviousInjury 1 @-4.293,4.175\n"+
"ContactSport 1 @-1.157,2.548\n"+
"TissueWeakness 1 @4.236,1.857\n"+
"IntraGameProprioception 1 @-1.196,8.487\n"+
"FitnessLevel 1 @-1.489,-4.530\n"+
"NeuromuscularFatigue 1 @1.501,-1.235", 
   l: "Shrier & Platt, 2008"
},

{
  v: "x3 E @-7.255,2.657\n"+
"x15 O @5.872,3.552\n"+
"x4 1 @-7.549,-5.201\n"+
"x5 1 @-4.116,-0.611\n"+
"x6 1 @-4.389,7.029\n"+
"x7 1 @-1.746,2.484\n"+
"x8 1 @2.209,6.269\n"+
"x9 1 @1.392,1.874\n"+
"x10 1 @3.925,-0.307\n"+
"x11 1 @-1.569,-4.200\n"+
"x12 1 @1.903,-4.093\n"+
"x13 1 @6.728,-4.093\n"+
"x14 1 @-0.676,9.163\n"+
"x16 1 @5.343,9.342\n"+
"x17 1 @7.417,7.412\n"+
"x18 1 @7.260,0.141\n"+
"x1 1 @-10.173,-1.479\n"+
"x2 1 @-9.832,5.930",
  e: "x4 x5\n"+
  "x5 x7 x11\n"+
  "x6 x7 x14\n"+
  "x7 x9\n"+
  "x8 x14 x15\n"+
  "x9 x10\n"+
  "x10 x12 x15\n"+
  "x11 x12\n"+
  "x12 x13\n"+
  "x13\n"+
  "x14 x16\n"+
  "x16 x17\n"+
  "x17\n"+
  "x18\n"+
  "x1 x4 x3\n"+
  "x2 x3\n"+
  "x15 x17 x18\n"+
  "x3 x6 x5",
  l: "Acid & de Campos, 1996" 
},

{
  v:"e0 U @0.108,0.697\n"+
"e1 U @0.284,0.682\n"+
"e2 1 @0.456,0.622\n"+
"e3 U @0.545,0.677\n"+
"e4 U @0.713,0.756\n"+
"s1 1 @0.266,0.802\n"+
"s2 A @0.457,0.811\n"+
"s3 1 @0.645,0.822\n"+
"x E @0.084,0.942\n"+
"y O @0.810,0.947\n"+
"z 1 @0.357,0.891\n"+
"z2 1 @0.554,0.908\n"+
"z3 1 @0.958,0.899",

e:"e0 x\n"+
"e1 s1\n"+
"e2 s2 @0.446,0.643 y @0.949,0.690\n"+
"e3 s3\n"+
"e4 y\n"+
"s1 s2 z\n"+
"s2 s3 z2\n"+
"s3 y\n"+
"x y s1\n"+
"y z3\n",

  l: "Thoemmes, 2013"
},

{
	v: "AFF 1 @0.262,0.477\n"+
	"AIS 1 @0.123,0.736\n"+
	"ALN 1 @0.438,0.506\n"+
	"APA 1 @0.376,0.147\n"+
	"CDR 1 @0.628,0.332\n"+
	"DET 1 @0.920,0.561\n"+
	"EGC O @0.916,1.016\n"+
	"FTW 1 @0.667,0.639\n"+
	"HOS 1 @0.886,0.727\n"+
	"PER 1 @0.920,0.382\n"+
	"SAN 1 @0.031,0.371\n"+
	"SUS E @0.295,1.003",

	e: 	"AFF ALN APA CDR\n"+
	"AIS AFF EGC SUS\n"+
	"ALN APA DET FTW PER SUS\n"+
	"CDR DET\n"+
	"EGC HOS\n"+
	"FTW DET EGC\n"+
	"SAN ALN AFF AIS APA CDR\n"+
	"SUS EGC FTW HOS\n"+
	"PER DET\n",

	l: "van Kampen, 2014"
},

{
	"d": `
dag {
Age [adjusted,pos="-1.973,-0.123"]
HRT [exposure,pos="-0.536,-0.016"]
Occ [pos="-1.645,0.432"]
S [selected,pos="0.925,-0.500"]
Smo [adjusted,pos="-0.879,0.441"]
TCI [outcome,pos="0.488,0.090"]
Thist [pos="-0.569,1.027"]
Age -> HRT
Age -> Occ
Age -> S [pos="-0.945,-0.571"]
Age -> TCI [pos="-0.264,-0.456"]
HRT -> TCI
Occ -> Smo
Occ -> Thist
Smo -> HRT
Smo -> TCI
TCI -> S
Thist -> TCI
}`,
	l: "Didelez et al, 2010"
	}
]; 

}));
