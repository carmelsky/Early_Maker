angular.module('app.controllers', ['firebase'])


  .controller('loginCtrl', function($scope, $rootScope, $ionicHistory, sharedUtils, $state, $ionicSideMenuDelegate) {
    $rootScope.extras = false; // For hiding the side bar and nav icon

    // When the user logs out and reaches login page,
    // we clear all the history and cache to prevent back link
    $scope.$on('$ionicView.enter', function(ev) {
      if (ev.targetScope !== $scope) {
        $ionicHistory.clearHistory();
        $ionicHistory.clearCache();
      }
    });




    //Check if user already logged in
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        $ionicHistory.nextViewOptions({
          historyRoot: true
        });
        $ionicSideMenuDelegate.canDragContent(true); // Sets up the sideMenu dragable
        $rootScope.extras = true;
        sharedUtils.hideLoading();
        $state.go('accueil', {}, {
          location: "replace"
        });

      }
    });


    $scope.loginEmail = function(formName, cred) {


      if (formName.$valid) { // Check if the form data is valid or not

        sharedUtils.showLoading();

        //Email
        firebase.auth().signInWithEmailAndPassword(cred.email, cred.password).then(function(result) {

            // You dont need to save the users session as firebase handles it
            // You only need to :
            // 1. clear the login page history from the history stack so that you cant come back
            // 2. Set rootScope.extra;
            // 3. Turn off the loading
            // 4. Got to menu page

            $ionicHistory.nextViewOptions({
              historyRoot: true
            });
            $rootScope.extras = true;
            sharedUtils.hideLoading();

            $state.go('accueil');

          },
          function(error) {
            sharedUtils.hideLoading();
            sharedUtils.showAlert("Please note", "Authentication Error");
          }
        );

      } else {
        sharedUtils.showAlert("Please note", "Entered data is not valid");
      }



    };


    $scope.loginFb = function() {
      //Facebook Login
    };

    $scope.loginGmail = function() {
      //Gmail Login
    };


  })

  .controller('signupCtrl', function($scope, $rootScope, sharedUtils, $ionicSideMenuDelegate,
    $state, fireBaseData, $ionicHistory) {
    $rootScope.extras = false; // For hiding the side bar and nav icon

    $scope.signupEmail = function(formName, user) {

      if (formName.$valid) { // Check if the form data is valid or not

        sharedUtils.showLoading();

        //Main Firebase Authentication part
        firebase.auth().createUserWithEmailAndPassword(user.email, user.password).then(function(result) {

          //Add name and default dp to the Autherisation table
          result.updateProfile({
            displayName: user.name,
            photoURL: "default_dp"
          }).then(function() {}, function(error) {});







          fireBaseData.refUser().child(result.uid).set({ // set

            name: user.name,
            email: user.email,
            role: "user",
            telephone: user.phone,
            score_quiz1: 0,
            score_quiz2: 0,
            score_quiz3: 0,
            score_quiz4: 0,
            notes: "Bonjour voila vos notes:"


          });






          //Registered OK
          $ionicHistory.nextViewOptions({
            historyRoot: true
          });
          $ionicSideMenuDelegate.canDragContent(true); // Sets up the sideMenu dragable
          $rootScope.extras = true;
          sharedUtils.hideLoading();
          $state.go('accueil', {}, {
            location: "replace"
          });


        }, function(error) {
          sharedUtils.hideLoading();
          sharedUtils.showAlert("Please note", "Sign up Error");
        });

      } else {
        sharedUtils.showAlert("Please note", "Entered data is not valid");
      }

    }

  })

  .controller('accueilCtrl', function($scope, $rootScope, $ionicSideMenuDelegate, fireBaseData, $state,
    $ionicHistory, $firebaseArray, $firebaseObject, sharedCartService, sharedUtils) {

    $scope.load = function() {
      $scope.xx = $firebaseArray(fireBaseData.refUser());
      $scope.getDatetime = new Date();
    }

    $scope.voir_profil = function(name) {
      $state.go('profile_animateur', {
        name_animatuer: name
      });


    }
    //Check if user already logged in
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {

        $scope.user_info = user; //Saves data to user_info
        $scope.user_extras = $firebaseObject(fireBaseData.refUser().child(user.uid));


      } else {

        $ionicSideMenuDelegate.toggleLeft(); //To close the side bar
        $ionicSideMenuDelegate.canDragContent(false); // To remove the sidemenu white space

        $ionicHistory.nextViewOptions({
          historyRoot: true
        });
        $rootScope.extras = false;
        sharedUtils.hideLoading();
        $state.go('tabsController.login', {}, {
          location: "replace"
        });

      }
    });

    // On Loggin in to menu page, the sideMenu drag state is set to true
    $ionicSideMenuDelegate.canDragContent(true);
    $rootScope.extras = true;

    // When user visits A-> B -> C -> A and clicks back, he will close the app instead of back linking
    $scope.$on('$ionicView.enter', function(ev) {
      if (ev.targetScope !== $scope) {
        $ionicHistory.clearHistory();
        $ionicHistory.clearCache();
      }
    });






  })



  .controller('indexCtrl', function($scope, $rootScope, sharedUtils, $ionicHistory, $state, $ionicSideMenuDelegate, sharedCartService) {

    //Check if user already logged in
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        $scope.user_info = user; //Saves data to user_info



      } else {

        $ionicSideMenuDelegate.toggleLeft(); //To close the side bar
        $ionicSideMenuDelegate.canDragContent(false); // To remove the sidemenu white space

        $ionicHistory.nextViewOptions({
          historyRoot: true
        });
        $rootScope.extras = false;
        sharedUtils.hideLoading();
        $state.go('tabsController.login', {}, {
          location: "replace"
        });

      }
    });

    $scope.logout = function() {

      sharedUtils.showLoading();

      // Main Firebase logout
      firebase.auth().signOut().then(function() {


        $ionicSideMenuDelegate.toggleLeft(); //To close the side bar
        $ionicSideMenuDelegate.canDragContent(false); // To remove the sidemenu white space

        $ionicHistory.nextViewOptions({
          historyRoot: true
        });


        $rootScope.extras = false;
        sharedUtils.hideLoading();
        $state.go('tabsController.login', {}, {
          location: "replace"
        });

      }, function(error) {
        sharedUtils.showAlert("Error", "Logout Failed")
      });

    }

  })
  .controller('quiz_1Ctrl', function($scope, $rootScope, sharedUtils, $ionicSideMenuDelegate,
    $state, fireBaseData, $ionicHistory) {


    //Check if user already logged in
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        $scope.ajouter_test = function(formName, test) {
          fireBaseData.reftest().push({ // set
            contenu: test.contenu

          });
        }
      }
    });
    //Check if user already logged in
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        $scope.ajouter_ex = function(formName, exercice) {
          fireBaseData.refexercice().push({ // set
            contenu: exercice.contenu,
            type: exercice.type

          });
        }
      }
    });
    //Check if user already logged in
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        $scope.ajouter_text = function(formName, text) {
          fireBaseData.reftext().push({ // set
            contenu: text.contenu,

            date: text.date
          });
        }
      }
    });
    //Check if user already logged in
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        $scope.ajouter_video = function(formName, video) {
          fireBaseData.refvideo().push({ // set
            lien: video.lien,

            titre: video.titre
          });
        }
      }
    });

  })
  .controller('quiz_2Ctrl', function($scope, $rootScope, sharedUtils, $ionicSideMenuDelegate,
    $state, fireBaseData, $ionicHistory, $firebaseArray) {

    $scope.loadtest = function(indice) {
      $scope.show_next = true
      $scope.show_previous = true
      $scope.show_score = false
      sharedUtils.showLoading();
      $scope.test = $firebaseArray(fireBaseData.reftest());
      sharedUtils.hideLoading();
      $scope.score = 0
      $scope.next = indice;
      if ($scope.next == 1) {
        $scope.show_previous = false
      }
      if ($scope.next == 10) {
        $scope.show_next = false
      }
    }

    $scope.calcule_score = function(quiz, indice, choix) {

      $scope.show_next = true
      $scope.show_previous = true
      sharedUtils.showLoading();
      $scope.test = $firebaseArray(fireBaseData.reftest());
      sharedUtils.hideLoading();
      $scope.score = $scope.score + parseInt(choix);
      $scope.next = indice;
      if ($scope.next == 1) {
        $scope.show_previous = false
      }
      if ($scope.next == 11) {
        $scope.show_next = false
        $scope.show_score = true


        firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            fireBaseData.refUser().child(user.uid).update({ // set
              score_quiz2: $scope.score

            });

          }
        });






      }
    }

  })

  .controller('quiz_3Ctrl', function($scope, $rootScope, sharedUtils, $ionicSideMenuDelegate,
    $state, fireBaseData, $ionicHistory, $firebaseArray) {

    $scope.loadtest = function(indice) {
      $scope.show_next = true
      $scope.show_previous = true
      $scope.show_score = false
      sharedUtils.showLoading();
      $scope.test = $firebaseArray(fireBaseData.reftest());
      sharedUtils.hideLoading();
      $scope.score = 0
      $scope.next = indice;
      if ($scope.next == 1) {
        $scope.show_previous = false
      }
      if ($scope.next == 10) {
        $scope.show_next = false
      }
    }

    $scope.calcule_score = function(quiz, indice, choix) {

      $scope.show_next = true
      $scope.show_previous = true
      sharedUtils.showLoading();
      $scope.test = $firebaseArray(fireBaseData.reftest());
      sharedUtils.hideLoading();
      $scope.score = $scope.score + parseInt(choix);
      $scope.next = indice;
      if ($scope.next == 1) {
        $scope.show_previous = false
      }
      if ($scope.next == 11) {
        $scope.show_next = false
        $scope.show_score = true


        firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            fireBaseData.refUser().child(user.uid).update({ // set
              score_quiz3: $scope.score

            });

          }
        });






      }
    }

  })
  .controller('quiz_4Ctrl', function($scope, $rootScope, sharedUtils, $ionicSideMenuDelegate,
    $state, fireBaseData, $ionicHistory, $firebaseArray) {

    $scope.loadtest = function(indice) {

      $scope.show_next = true
      $scope.show_previous = true
      $scope.show_score = false
      sharedUtils.showLoading();
      $scope.test = $firebaseArray(fireBaseData.reftest());
      sharedUtils.hideLoading();
      $scope.score = 0
      $scope.next = indice;
      if ($scope.next == 1) {
        $scope.show_previous = false
      }
      if ($scope.next == 10) {
        $scope.show_next = false
      }
    }

    $scope.calcule_score = function(quiz, indice, choix) {

      $scope.show_next = true
      $scope.show_previous = true
      sharedUtils.showLoading();
      $scope.test = $firebaseArray(fireBaseData.reftest());
      sharedUtils.hideLoading();
      $scope.score = $scope.score + parseInt(choix);
      $scope.next = indice;
      if ($scope.next == 1) {
        $scope.show_previous = false
      }
      if ($scope.next == 11) {
        $scope.show_next = false
        $scope.show_score = true


        firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            fireBaseData.refUser().child(user.uid).update({ // set
              score_quiz4: $scope.score

            });

          }
        });

      }
    }

  })

  .controller('noteCtrl', function($scope, $rootScope, sharedUtils, $ionicSideMenuDelegate,
    $state, fireBaseData, $ionicHistory, $firebaseObject, $firebaseArray) {

    //Check if user already logged in
    firebase.auth().onAuthStateChanged(function(user) {
      $scope.user_extras = $firebaseObject(fireBaseData.refUser().child(user.uid));
      $scope.loadnotes = function() {

        $scope.user_extras = $firebaseObject(fireBaseData.refUser().child(user.uid));

      }

      $scope.save = function(note_form, note) {

        fireBaseData.refUser().child(user.uid).update({
          notes: $scope.user_extras.notes + '\n\n' + note
        });
      }

      $scope.supp_notes = function() {

        fireBaseData.refUser().child(user.uid).update({
          notes: "Bonjour voila vos notes:"
        });



      }
    });
  })

  .controller('ExerciceCtrl', function($scope, $rootScope, sharedUtils, $ionicSideMenuDelegate,
    $state, fireBaseData, $ionicHistory, $firebaseObject, $firebaseArray) {


    $scope.get_ex = function(choix, x) {
      $state.go('t_v_atelier1', {
        hygene: choix,
        atelier: x
      });


    }




  })
  .controller('text_videoCtrl', function($scope, $rootScope, sharedUtils, $ionicSideMenuDelegate,
    $state, fireBaseData, $ionicHistory, $firebaseObject, $firebaseArray) {
    $scope.load = function(x) {
      $scope.a = x;
      $scope.getDatetime = new Date();
      $scope.newdate = $scope.getDatetime.setDate($scope.getDatetime.getDate() + x);
      $scope.date = $scope.getDatetime.toString().slice(4, 15).replace(/-/g, "");
      $scope.text = $firebaseArray(fireBaseData.reftext());
    }

    $scope.ajout_date = function(x) {

      $scope.getDatetime = new Date();
      $scope.newdate = $scope.getDatetime.setDate($scope.getDatetime.getDate() + x);
      $scope.date = $scope.getDatetime.toString().slice(4, 15).replace(/-/g, "")
      $scope.a = x;
      $scope.text = $firebaseArray(fireBaseData.reftext());
    }




  })
  .controller('videoCtrl', function($scope, $rootScope, sharedUtils, $ionicSideMenuDelegate,
    $state, fireBaseData, $ionicHistory, $firebaseObject, $firebaseArray, $sce) {
    $scope.load = function(x) {
      $scope.a = x;
      $scope.getDatetime = new Date();
      $scope.newdate = $scope.getDatetime.setDate($scope.getDatetime.getDate() + x);
      $scope.date = $scope.getDatetime.toString().slice(4, 15).replace(/-/g, "");
      $scope.video = $firebaseArray(fireBaseData.refvideo());
    }

    $scope.ajout_date = function(x) {

      $scope.getDatetime = new Date();
      $scope.newdate = $scope.getDatetime.setDate($scope.getDatetime.getDate() + x);
      $scope.date = $scope.getDatetime.toString().slice(4, 15).replace(/-/g, "")
      $scope.a = x;
      $scope.video = $firebaseArray(fireBaseData.refvideo());
    }




  })
  .controller('profile_animateurCtrl', function($scope, $rootScope, sharedUtils, $ionicSideMenuDelegate,
    $state, fireBaseData, $ionicHistory, $firebaseObject, $firebaseArray, $stateParams) {


    $scope.load_profil = function() {
      $scope.nom = $stateParams.name_animatuer;
      $scope.xx = $firebaseArray(fireBaseData.refUser());

    }




  })
  .controller('t_v_atelier1Ctrl', function($scope, $rootScope, sharedUtils, $ionicSideMenuDelegate,
    $state, fireBaseData, $ionicHistory, $firebaseObject, $firebaseArray, $stateParams) {



    $scope.loadexercice = function() {


      $scope.hygene = $stateParams.hygene;
      $scope.atelier = $stateParams.atelier;
      $scope.ex = $firebaseArray(fireBaseData.refexercice());


    }





  })


  .controller('settingsCtrl', function($scope, $rootScope, fireBaseData, $firebaseObject,
    $ionicPopup, $state, $window, $firebaseArray,
    sharedUtils) {
    //Bugs are most prevailing here
    $rootScope.extras = true;

    //Shows loading bar
    sharedUtils.showLoading();

    //Check if user already logged in
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {

        //Accessing an array of objects using firebaseObject, does not give you the $id , so use firebase array to get $id
        $scope.addresses = $firebaseArray(fireBaseData.refUser().child(user.uid).child("address"));

        // firebaseObject is good for accessing single objects for eg:- telephone. Don't use it for array of objects
        $scope.user_extras = $firebaseObject(fireBaseData.refUser().child(user.uid));

        $scope.user_info = user; //Saves data to user_info
        //NOTE: $scope.user_info is not writable ie you can't use it inside ng-model of <input>

        //You have to create a local variable for storing emails
        $scope.data_editable = {};
        $scope.data_editable.email = $scope.user_info.email; // For editing store it in local variable
        $scope.data_editable.password = "";

        $scope.$apply();

        sharedUtils.hideLoading();

      }

    });

    $scope.addManipulation = function(edit_val) { // Takes care of address add and edit ie Address Manipulator


      if (edit_val != null) {
        $scope.data = edit_val; // For editing address
        var title = "Edit Address";
        var sub_title = "Edit your address";
      } else {
        $scope.data = {}; // For adding new address
        var title = "Add Address";
        var sub_title = "Add your new address";
      }
      // An elaborate, custom popup
      var addressPopup = $ionicPopup.show({
        template: '<input type="text"   placeholder="Nick Name"  ng-model="data.nickname"> <br/> ' +
          '<input type="text"   placeholder="Address" ng-model="data.address"> <br/> ' +
          '<input type="number" placeholder="Pincode" ng-model="data.pin"> <br/> ' +
          '<input type="number" placeholder="Phone" ng-model="data.phone">',
        title: title,
        subTitle: sub_title,
        scope: $scope,
        buttons: [{
            text: 'Close'
          },
          {
            text: '<b>Save</b>',
            type: 'button-positive',
            onTap: function(e) {
              if (!$scope.data.nickname || !$scope.data.address || !$scope.data.pin || !$scope.data.phone) {
                e.preventDefault(); //don't allow the user to close unless he enters full details
              } else {
                return $scope.data;
              }
            }
          }
        ]
      });

      addressPopup.then(function(res) {

        if (edit_val != null) {
          //Update  address
          if (res != null) { // res ==null  => close
            fireBaseData.refUser().child($scope.user_info.uid).child("address").child(edit_val.$id).update({ // set
              nickname: res.nickname,
              address: res.address,
              pin: res.pin,
              phone: res.phone
            });
          }
        } else {
          //Add new address
          fireBaseData.refUser().child($scope.user_info.uid).child("address").push({ // set
            nickname: res.nickname,
            address: res.address,
            pin: res.pin,
            phone: res.phone
          });
        }

      });

    };

    // A confirm dialog for deleting address
    $scope.deleteAddress = function(del_id) {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Delete Address',
        template: 'Are you sure you want to delete this address',
        buttons: [{
            text: 'No',
            type: 'button-stable'
          },
          {
            text: 'Yes',
            type: 'button-assertive',
            onTap: function() {
              return del_id;
            }
          }
        ]
      });

      confirmPopup.then(function(res) {
        if (res) {
          fireBaseData.refUser().child($scope.user_info.uid).child("address").child(res).remove();
        }
      });
    };

    $scope.save = function(extras, editable) {
      //1. Edit Telephone doesnt show popup 2. Using extras and editable  // Bugs
      if (extras.telephone != "" && extras.telephone != null) {
        //Update  Telephone
        fireBaseData.refUser().child($scope.user_info.uid).update({ // set
          telephone: extras.telephone
        });
      }

      //Edit Password
      if (editable.password != "" && editable.password != null) {
        //Update Password in UserAuthentication Table
        firebase.auth().currentUser.updatePassword(editable.password).then(function(ok) {}, function(error) {});
        sharedUtils.showAlert("Account", "Password Updated");
      }

      //Edit Email
      if (editable.email != "" && editable.email != null && editable.email != $scope.user_info.email) {

        //Update Email/Username in UserAuthentication Table
        firebase.auth().currentUser.updateEmail(editable.email).then(function(ok) {
          $window.location.reload(true);
          //sharedUtils.showAlert("Account","Email Updated");
        }, function(error) {
          sharedUtils.showAlert("ERROR", error);
        });
      }

    };

    $scope.cancel = function() {
      // Simple Reload
      $window.location.reload(true);
      console.log("CANCEL");
    }

  })


  //TODO:Controlleur du chat
  .controller('chatCtrl', function($scope, $rootScope, sharedUtils, $ionicSideMenuDelegate,
    $state, fireBaseData, $ionicHistory, $firebaseObject, $firebaseArray) {

      //TODO: affichage de la liste des conversations
      //console.log(user.displayName + " " + user.email);
      var utilisateur = fireBaseData.utilisateur();

      if(utilisateur){
        $scope.user = utilisateur.displayName;

        var queryMessages = firebase.database().ref('/chat/conversations/').orderByChild('users/' + $scope.user + '').equalTo(true);

        queryMessages.on('value', function(snapshot) {
          console.log(snapshot.val());
          $scope.conversations = snapshot.val();
        });


      }

      $scope.discussion = function(conversation) {
        $state.go("conversation", {
          "conversation": conversation
        });
      };

  })

  .controller('conversationCtrl', function($scope, $rootScope, sharedUtils, $ionicSideMenuDelegate,
    $state, fireBaseData, $ionicHistory, $firebaseObject, $firebaseArray, $stateParams) {
    //Bugs are most prevailing here
    $rootScope.extras = true;

    var utilisateur = fireBaseData.utilisateur();

    if(utilisateur){
      console.log(utilisateur);

      $scope.conversation = $stateParams.conversation;
      $scope.user = utilisateur.displayName;

      var queryMessages = fireBaseData.refchat().child("messages").orderByChild('conversation').equalTo($scope.conversation);;
      //firebase.database().ref('/chat/messages/');

      queryMessages.on('value', function(snapshot) {
        console.log(snapshot.val());
      });

      $scope.messages = $firebaseArray(queryMessages);

      // Quand on recoit un message, on joue une musique
      queryMessages.on('child_added', function(snap) {
        var newMessage = snap.val();
        if (newMessage.user != $scope.user) {
          var audio = new Audio('img/sons/message.mp3');
          audio.play();
        }
      });


      //Quand l'utilisateur clique sur le bouton "envoyer"
      $scope.add = function(add) {
        //Ajouter un  message a une conversation
        $scope.messages.$add({
          "conversation": $scope.conversation,
          "date": new Date().getTime(),
          "user": $scope.user,
          "content": add.message
        });
        $scope.add.message = "";

      };

    }




      // Ajouter un  membre a une conversation
      //  $scope.conversations.$add({
      //    "conversation" : $scope.conversation,
      //    "date": new Date().getTime(),
      //    "membre": add.message
      //  });
      //  $scope.add.message= "";



  })

  .controller('supportCtrl', function($scope, $rootScope) {

    $rootScope.extras = true;

  })

  .controller('forgotPasswordCtrl', function($scope, $rootScope) {
    $rootScope.extras = false;
  })

  .controller('checkoutCtrl', function($scope, $rootScope, sharedUtils, $state, $firebaseArray,
    $ionicHistory, fireBaseData, $ionicPopup, sharedCartService) {

    $rootScope.extras = true;

    //Check if user already logged in
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        $scope.addresses = $firebaseArray(fireBaseData.refUser().child(user.uid).child("address"));
        $scope.user_info = user;
      }
    });

    $scope.payments = [{
        id: 'CREDIT',
        name: 'Credit Card'
      },
      {
        id: 'NETBANK',
        name: 'Net Banking'
      },
      {
        id: 'COD',
        name: 'COD'
      }
    ];

    $scope.pay = function(address, payment) {

      if (address == null || payment == null) {
        //Check if the checkboxes are selected ?
        sharedUtils.showAlert("Error", "Please choose from the Address and Payment Modes.")
      } else {
        // Loop throw all the cart item
        for (var i = 0; i < sharedCartService.cart_items.length; i++) {
          //Add cart item to order table
          fireBaseData.refOrder().push({

            //Product data is hardcoded for simplicity
            product_name: sharedCartService.cart_items[i].item_name,
            product_price: sharedCartService.cart_items[i].item_price,
            product_image: sharedCartService.cart_items[i].item_image,
            product_id: sharedCartService.cart_items[i].$id,

            //item data
            item_qty: sharedCartService.cart_items[i].item_qty,

            //Order data
            user_id: $scope.user_info.uid,
            user_name: $scope.user_info.displayName,
            address_id: address,
            payment_id: payment,
            status: "Queued"
          });

        }

        //Remove users cart
        fireBaseData.refCart().child($scope.user_info.uid).remove();

        sharedUtils.showAlert("Info", "Order Successfull");

        // Go to past order page
        $ionicHistory.nextViewOptions({
          historyRoot: true
        });
        $state.go('lastOrders', {}, {
          location: "replace",
          reload: true
        });
      }
    }



    $scope.addManipulation = function(edit_val) { // Takes care of address add and edit ie Address Manipulator


      if (edit_val != null) {
        $scope.data = edit_val; // For editing address
        var title = "Edit Address";
        var sub_title = "Edit your address";
      } else {
        $scope.data = {}; // For adding new address
        var title = "Add Address";
        var sub_title = "Add your new address";
      }
      // An elaborate, custom popup
      var addressPopup = $ionicPopup.show({
        template: '<input type="text"   placeholder="Nick Name"  ng-model="data.nickname"> <br/> ' +
          '<input type="text"   placeholder="Address" ng-model="data.address"> <br/> ' +
          '<input type="number" placeholder="Pincode" ng-model="data.pin"> <br/> ' +
          '<input type="number" placeholder="Phone" ng-model="data.phone">',
        title: title,
        subTitle: sub_title,
        scope: $scope,
        buttons: [{
            text: 'Close'
          },
          {
            text: '<b>Save</b>',
            type: 'button-positive',
            onTap: function(e) {
              if (!$scope.data.nickname || !$scope.data.address || !$scope.data.pin || !$scope.data.phone) {
                e.preventDefault(); //don't allow the user to close unless he enters full details
              } else {
                return $scope.data;
              }
            }
          }
        ]
      });

      addressPopup.then(function(res) {

        if (edit_val != null) {
          //Update  address
          fireBaseData.refUser().child($scope.user_info.uid).child("address").child(edit_val.$id).update({ // set
            nickname: res.nickname,
            address: res.address,
            pin: res.pin,
            phone: res.phone
          });
        } else {
          //Add new address
          fireBaseData.refUser().child($scope.user_info.uid).child("address").push({ // set
            nickname: res.nickname,
            address: res.address,
            pin: res.pin,
            phone: res.phone
          });
        }

      });

    };


  })
