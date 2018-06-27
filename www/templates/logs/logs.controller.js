;(function () {
  'use strict';

  angular.module('app')
    .controller('LogsController', LogsController);

  LogsController.$inject = ['$ionicModal', '$state', '$scope', '$timeout', '$localStorage', 'userService', 'consultants',
                            'rights_to_kid'];


  function LogsController($ionicModal, $state, $scope, $timeout, $localStorage, userService, consultants, rights_to_kid) {
    const vm = this;

    vm.toMainPage = toMainPage;
    vm.toKid = toKid;

    vm.logStatus = logStatus;
    vm.emergencyView = emergencyView;
    vm.kidPhone = kidPhone;
    vm.getConsultName = getConsultName;
    vm.dateConverter = dateConverter;
    vm.timeConverter = timeConverter;

    vm.showAllInfo = showAllInfo;
    vm.fullEmergencyLog = fullEmergencyLog;

    vm.showAllNormalStatus = showAllNormalStatus;

    vm.arrowAnimation = arrowAnimation;

    let kids = $localStorage.kids;
    let kid = kids[$localStorage.log_index];
    vm.kidName = getKidName();
    vm.pushView = [];
    vm.editRights = rights_to_kid;

    console.log('consultants', consultants);
    console.log('rights to edit kid', rights_to_kid);

    function getKidName() {
      let full_name = kid.name;
      return full_name;
      // let first_name = full_name.split(' ')[0];
      // return first_name;
    }

    function toMainPage() {
      console.log('to main page');
      $state.go('parent-main-page')
    }
    function toKid() {
      // for(let i = 0; i < kids.length; i++) {
      //   if (kid.id === kids[i].id) { $localStorage.kid_index = i; break;}
      // }

      $localStorage.kid_index = angular.copy($localStorage.log_index);

      console.log('to kid page');
      $state.go('kid');
    }

    function logStatus(log) {
      if (log.status === 'emergency') {
        return 'emergency-log'
      } else if (log.status === 'normal') {
        return 'normal-log'
      }
    }
    function emergencyView(log) {
      if (log.status === 'emergency') {
        return true;
      } else if (log.status === 'normal') {
        return false;
      }
    }
    function kidPhone() {
      return 'tel:' + kid.phone.code + kid.phone.phone
    }
    function getConsultName(log) {
      console.log();
      let name = '';
      for (let i = 0; i < consultants.length; i++) {
        if (consultants[i].id === log.consultant_id) { name = consultants[i].name }
      }
      return name;
    }
    function dateConverter(log) {
      let timestamp = log.created_at;

      let day = new Date(timestamp).getDate();
      let month = new Date(timestamp).getMonth() + 1;
      let year = new Date(timestamp).getFullYear();

      if (day < 10) { day = '0' + String(day); }
      if (month < 10) { month = '0' + String(month); }

      return day + '/' + month + '/' + year;
    }
    function timeConverter(log) {
      let timestamp = log.created_at;

      let hours = new Date(timestamp).getHours();
      let minutes = new Date(timestamp).getMinutes();
      if (hours < 10) {
        hours = '0' + String(hours);
      }
      if (minutes < 10) {
        minutes = '0' + String(minutes);
      }

      return hours + ':' + minutes;
    }

    function showAllInfo(index) {
      vm.pushView[index] = !vm.pushView[index];
    }
    function fullEmergencyLog(index) {
      if (vm.pushView[index] && vm.logs[index].status == 'emergency') {
        return true;
      } else {
        return false
      }
    }
    function showAllNormalStatus(index) {
      if (vm.pushView[index] && vm.logs[index].status != 'emergency') {
        return 'show-all-content-in-normal-status'
      }
    }

    function arrowAnimation(index) {
      if (vm.pushView[index]) { return 'arrow-clockwise' } else { return 'arrow-counterclockwise' }
    }


    let fb = firebase.database();
    let kid_id = kid.id;
    let number_of_logs = 50;
    let download_more = 25;

    vm.logs = [];
    fb.ref('/logs/' + kid_id).on('value', (snapshot) => {
      $timeout(function () {
        $timeout(function () {
          // snapshot.val() ? vm.logs = snapshot.val() : vm.logs = [];
          snapshot.val() ? vm.logs = convertToArray() : vm.logs = [];
          function convertToArray() {
            let res = [];
            let arrOfKeys = Object.keys(snapshot.val());
            angular.forEach(arrOfKeys ,function (key) {
              res.push(snapshot.val()[key]);
              vm.pushView.push(false);
            });
            res.reverse();
            vm.pushView.reverse();
            // console.log(vm.pushView);
            return res;
          }
          console.log(vm.logs);
        })
      });
    });

  }
})();
