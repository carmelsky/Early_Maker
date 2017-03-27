angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider



  .state('tabsController', {
    url: '/page1',
    templateUrl: 'templates/tabsController.html',
    abstract:true
  })

  .state('tabsController.login', {
    url: '/page5',
    views: {
      'tab1': {
        templateUrl: 'templates/login.html',
        controller: 'loginCtrl'
      }
    }
  })
  .state('tabsController.accueil', {
      url: '/accueil',
      templateUrl: 'templates/accueil.html',
      controller: 'accueilCtrl'
    })


  .state('tabsController.signup', {
    url: '/page6',
    views: {
      'tab3': {
        templateUrl: 'templates/signup.html',
        controller: 'signupCtrl'
      }
    }
  })

  .state('accueil', {
      url: '/page7',
      templateUrl: 'templates/accueil.html',
      controller: 'accueilCtrl'
    })
	.state('video', {
      url: '/video',
      templateUrl: 'templates/video.html',
      controller: 'videoCtrl'
    })
	.state('test', {
      url: '/test',
      templateUrl: 'templates/test.html',
      //controller: 'testCtrl'
    })
	.state('Exercice', {
      url: '/Exercice',
      templateUrl: 'templates/Exercice.html',
      controller: 'ExerciceCtrl'
    })
	.state('quiz_1', {
      url: '/Quiz 1',
      templateUrl: 'templates/quiz_1.html',
      controller: 'quiz_1Ctrl'
    })
	.state('quiz_2', {
      url: '/Quiz 2',
      templateUrl: 'templates/quiz_2.html',
      controller: 'quiz_2Ctrl'
    })
	.state('quiz_3', {
      url: '/Quiz 3',
      templateUrl: 'templates/quiz_3.html',
      controller: 'quiz_3Ctrl'
    })
	.state('quiz_4', {
      url: '/Quiz 4',
      templateUrl: 'templates/quiz_4.html',
      controller: 'quiz_4Ctrl'
    })

	.state('text_video', {
      url: '/text_video',
      templateUrl: 'templates/text_video.html',
      controller: 'text_videoCtrl'
    })
	.state('profile_animateur', {
      url: '/profile_animateur/:name_animatuer',
      templateUrl: 'templates/profile_animateur.html',
      controller: 'profile_animateurCtrl'
    })
	.state('t_v_atelier1', {
      url: '/textes et vidéos atelier1/:hygene/:atelier',
      templateUrl: 'templates/t_v_atelier1.html',
      controller: 't_v_atelier1Ctrl'
    })
	.state('t_v_atelier2', {
      url: '/textes et vidéos atelier2',
      templateUrl: 'templates/t_v_atelier2.html',
      //controller: 't_v_atelier1Ctrl'
    })
	.state('t_v_atelier3', {
      url: '/textes et vidéos atelier3',
      templateUrl: 'templates/t_v_atelier3.html',
      //controller: 't_v_atelier1Ctrl'
    })
	.state('t_v_atelier4', {
      url: '/textes et vidéos atelier4',
      templateUrl: 'templates/t_v_atelier4.html',
      //controller: 't_v_atelier1Ctrl'
    })
	.state('note', {
      url: '/Mes notes',
      templateUrl: 'templates/note.html',
      controller: 'noteCtrl'
    })

  .state('settings', {
    url: '/page12',
    templateUrl: 'templates/settings.html',
    controller: 'settingsCtrl'
  })

  .state('support', {
    url: '/page13',
    templateUrl: 'templates/support.html',
    controller: 'supportCtrl'
  })
  .state('chat', {
    url: '/chat',
    templateUrl: 'templates/chat.html',
    controller: 'chatCtrl'
  })
  .state('conversation', {
    url: '/conversation/:conversation',
    templateUrl: 'templates/conversation.html',
    controller: 'conversationCtrl'
  })
  .state('tabsController.forgotPassword', {
    url: '/page15',

    views: {
      'tab1': {
        templateUrl: 'templates/forgotPassword.html',
        controller: 'forgotPasswordCtrl'
      }
    }
  })

$urlRouterProvider.otherwise('/page1/page5')



});
