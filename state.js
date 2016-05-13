var Freezer = require('freezer-js'),
  // db = require('./db'),
	moment = require('moment'),
	_ = require('lodash');

var React = require('react-native');
var {
  Animated
} = React;

// Try to recover the state from the localStorage
// console.log("in state.js db_ready", db.db_ready);
var state = {
	admin : {
		ui : {
			loadConfig: true,
			refresh : true,
			tabno : 0,
			viewno : 0

		},
		serverConfig : {
			data : {
			}
		},
		userConfig : {
			data : {

			}
		}
	},
	admin_defaults : {
		serverConfig : {
			serverUrl : 'http://127.0.0.1@8984',
			userid : 'admin',
			password : ''

		},
		userConfig : {
			agentCode : '10634',
			agentName : 'Agent Bond',
			organId : '101'
		}
	},
	fnaList : {
		ui : {
			filter : null ,
			tabno : 0,
			currentFna: null,
			selectedFnas : [],
		},

	},
	fna : {
		ui : {
			loadFna: true,
			refresh : true,
			tabno : 0,
			viewno : 0,
			currentContact : null,

		},
		personalData: {
			data : {
			},
			people : []
		},
		protectionNeeds : {
			data : {}
		},
		otherNeeds : {
			data : {}
		},
		riskProfile : {
			data : {}
		},
		recommendations : {
			data : {}
		}
	},
	fna_defaults : {
		personalData : {},
		protectionNeeds : {
			monthlyExpense : 0,
			yearlyExpense : 0,
			depositInterest : 0.12,
			protectionNeeds : 0,
			lifeCover : 0,
			ciCover : 0,
			accidentCover : 0 ,
			healthCover : 0,
			totalCover : 0,
			shortfall : 0,

		},
		otherNeeds : {
			childEducation : 0,
			pension : 0,
			warisan : 0,
			lifeStyle : 0
		},
		riskProfile : { totalScore : 0 },
		recommendations : {}
	},
	proposal_list : {
		ui : {
			filter : null ,
			tabno : 0,
			current_id : null,
			selectedProposals : [],
		}
	},
	proposal : {
		ui : {
			current_section : 1,
			section_1_ok : false,
			section_2_ok : false,
			section_3_ok : false
		},
		s1 : {
			ui : {
				refresh : true,
				tabno : 0,
				viewno : 0,
				contact_id : null,
				quote_id : null ,
				proposal_id : null,
				owner : '',
				updated : true,
				ph : { base_menu_items : ['Standard']},
				la : { base_menu_items : ['Standard']},
				savedSignature: false

			},
			ph : {
				data : {},
				contacts : [],
				addresses : [],
				dependents : [],
				notes : [],
				base : { questions : {} },
				family_hist : { questions : {} },
				health : { questions : {} },
				doctor : { questions : {} },
			},
			la : {
				data : {},
				contacts : [],
				addresses : [],
				dependents : [],
				notes : [],
				base : { questions : {} },
				family_hist : { questions : {} },
				health : { questions : {} },
				doctor : { questions : {} },

			},
			quotation : {},
			// main : {
			// 	data : {}
			// },
			// riders : [],
			// funds : [],
			paymentinfo : {
				data : {}
			},
			beneficiaries : [],
			policies : [],
			pdpa : { questions : {} },
			owner : { data : {} },
			documents : {
				data : {
					phIdentification : false,
					laIdentification : false,
					creditCard : false,
					fna : false,
				},
				photos : {}
			},
			signature : {}

		},
		s1_defaults : {
			ph : {
				type : 'Person'
			},
			ph_address : {
				type : 'Home'
			},

			base_questions : {
				q1_height : 0,
				q1_weight : 0,
				q2_yesno : false,
				q3_yesno : false,
				q4_yesno : false,
				q5_yesno : false,
				q6_yesno : false,
				q7_yesno : false,
				q8_yesno : false,
				q9_yesno : false,
				q10_yesno : false,
				q11_yesno : false,
			},
			family_hist : {
				q1 : false,
				q2 : ''
			},
			health_question : {
				q1a : false,
				q1b : false,
				q1c : false,
				q1d : false,
				q1e : false,
				q1f : false,
				q1g : false,
				q1h : false,
				q1i : false,
				q1j : false,
				q1k : false,
				q1l : false,
				q1m : false,
				q2_yesno : false,
				q2a1 : 0,
				q2a2 : 0,
				q2b : false,
				q2c : false,
				q2d : false,
				q3_yesno : false,
				q3a1 : 'Normal',
			    q3a2 : '',
				q3a3 : '',
				q3b1 : '',
				q3b2 : '',
				q3c1 : '',
				q3c2 : '',
				q4 : false
			},
			documents : {
				data : {
					phIdentification : false,
					laIdentification : false,
					creditCard : false,
					fna : false,
				}
			},
			signature : {},
			agentReport : {
				yearsKnown : 0,
				related : false,
				annualIncome : 0,
				netWorth : 0,
				hasProsecution : false,
				purpose : 'Protection',
				otherFactors : false,
				rop : false,
				otherText: '',
				ropText : ''
			},

			policy : {
				owner : 'Policyholder',
				sum_assured : 0
			},
			pdpa : {
				questions : {
					pdpa_ok: true
				}
			},
			beneficiary :{
				gender : 'Female',
				relation : 'Spouse',
				percentage : 0
			},
			paymentinfo : {
				currency : 'Rph',
				payment_frequency : "1",
				payment_method : "Cash",
				payee : "Policyholder",
				fund_source : "Salary",

			},
			owner : {
				has_owner : false
			}
		},
		s2 : {
			ui : {
				refresh : true,
				tabno : 0,
				viewno : 0,
				contact_id : null,
				quote_id : null ,
				proposal_id : null,
				reload_proposal : true, // used to decide if we need to reload the proposal
				ph_is_la : false,
				base_menu_items : [
					'Standard'
				],
				q2_yesno : false,
				q3_yesno : false,
				q4_yesno : false,
				q7_yesno : false,
				q9_yesno : false,
				health_q2_yesno : false,
				signature : {
					sigPh : null,
					sigAgent : null,


				}
			},
			base : {
				questions : {}
			},
			family_hist : {
				questions : {}
			},
			health : {
				questions : {}
			},
			pdpa : {
				questions: { pdpa_ok: true}
			},
			doctor : {
				questions: {}
			},
			signature : {
				phIdentification : false,
				laIdentification : false,
				creditCard : false,
				fna : false,
				sign_location : '',
				phSig : null,
				agentSig : null,
				phHash : null,
				agentHash : null,
				photoPaths : {},
			}

		},
		s2_defaults : {
			base_questions : {
				q1_ph_height : 0,
				q1_ph_weight : 0,
				q1_la_height : 0,
				q1_la_weight : 0,
				q2_yesno : false,
				q3_yesno : false,
				q4_yesno : false,
				q5_yesno : false,
				q6_yesno : false,
				q7_yesno : false,
				q8_yesno : false,
				q9_yesno : false,
				q10_yesno : false,
				q11_yesno : false,
			},
			family_hist : {
				q1 : false,
				q2 : ''
			},
			health_question : {
				q1a : false,
				q1b : false,
				q1c : false,
				q1d : false,
				q1e : false,
				q1f : false,
				q1g : false,
				q1h : false,
				q1i : false,
				q1j : false,
				q1k : false,
				q1l : false,
				q1m : false,
				q2_yesno : false,
				q2a1 : 0,
				q2a2 : 0,
				q2b : false,
				q2c : false,
				q2d : false,
				q3_yesno : false,
				q3a1 : 'Normal',
			    q3a2 : '',
				q3a3 : '',
				q3b1 : '',
				q3b2 : '',
				q3c1 : '',
				q3c2 : '',
				q4 : false
			},
			pdpa : {
				pdpa_ok : true
			},
			doctor : {
			},
			signature : {
				phIdentification : false,
				laIdentification : false,
				creditCard : false,
				fna : false,
				sign_location : '',
				phSig : null,
				agentSig : null,
				phHash : null,
				agentHash : null,
				photos : {}
			}
		},
		s3 : {

		}

	},
	contact: {
		refresh : true,
        list_tabno : 0,
        filter : null,
        currentContact : null,
        selectedContacts : [],

    },
    contactinfo : {
        tabno : 0,
        viewno : 0,
        currentContact : null,
        refresh : true,
        filter : {},
        doc : {
            basic : {
                defaults : {
					gender: 'Male',
					type : 'Person'

                },
            },
            personal : {
                defaults : {
                    workYears : 0,
                    workMonths : 0
                }
            },
            data: {}
        },
        addresses : {
            data : [],
            defaults : {
                type : 'Home'
            }
        },
        contacts : {
            data : [],
            defaults : {

            }
        },
        dependents : {
            data : [],
            defaults : {
                gender : 'Male'
            }
        },
        notes : {
            data : [],
            defaults : {
				eventDate : moment().format("D-M-YYYY")
            }
        }
    },
	quote : {
        tabno : 0,
        // viewname : '',
        current_main : {},
        // current_plan : {},
        // current_inout : {},
        current_rider : {},
        current_fund : {},
        step : 0,
        offset : new Animated.Value(0),
        show_modal : false,
        show_signature : false,
        show_pdf : false,
        signatory : null,
        signatureOwner : null,
        signatureAgent : null,
		tempSignature : null,
		tempHash : null,
        hash_owner : null,
        hash_agent : null,
        pdf_path : null,
        slidemenu : true,
        status : 'Pending',
        lastModified : null,
        contact : null,
        quote : null,
        refresh : true,
		reloadQuote : true,
      	policy : {
    				data : [],
    				people : {
    						data : [{},{},{}],
    						lookups : {},
    						person : {
    							name : '',
    							dob : '',
    							age : '',
    							gender : 'Male',
    							occup_class : '1',
                                job_class : '1',
    							income : '',
    							is_ph : false
    						}
    				},
    				main : {
    					lookups: {
    						available_mains : [],
    						premium_terms : [],
    						payment_freqs : [],
    						life_assureds : [],
    						payment_methods : [[1,'Cash'],[2,'Cheque'],[3,'Direct Debit']],
    					},
    					transient : {},
                        data0 : {},
                        data1 : {},
                        defaults : {
                          data0 : {
            				      plan_code: '',
              	                  plan_name : '',
              					  proposal_date : moment().format("D-M-YYYY"),
              					  contract_date : moment().date(1).format("D-M-YYYY"),
              					  la         : '0' ,
              					  initial_sa : 0 ,
                                  target_premium : 0,
                                  rtu : 0,
                          },
                          data1 : {
              					  premium_term : 0,
              			// 		  payment_frequency : '1',
              					  payment_method : '1',
              					  coverage_term : 0,
              					  premium : 0,
								//   money_id : "",
                          }
                      }
    				},
    				riders : {
    					data : [],
    					lookups : {},
    					rider : {
    						plan_id : 0,
    						plan_code : '',
    						plan_name : '',
    						initial_sa : 0,
    						cover_term : 0,
    						occ_class : 1,
    					}
    				},
    				loadings : {
    					data : [],
    					lookups : [],
    					loading : {
    						type : '',
    						rate : 0.00,
    					}
    				},
    				funds : {
    					data : [],
    					lookups : {},
    					fund : {
    						fund_code : '',
    						fund_name : '',
    						allocation : 0.00
    					}
    				},
    				inout : {
    					data : [],
    					lookups : {},
                        defaults : {
                            in : '0',
    						out : '0',
    						year : ''
                        }


    				},
    		},
     },
};
// Returns the freezer instance with the state.
module.exports = new Freezer( state );
