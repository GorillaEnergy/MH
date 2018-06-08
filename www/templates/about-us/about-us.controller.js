;(function () {
  'use strict';

  angular.module('app')
    .controller('AboutUsController', AboutUsController);

  AboutUsController.$inject = ['$state'];


  function AboutUsController($state) {
    const vm = this;

    vm.toMenu = toMenu;

    vm.text = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab adipisci eveniet expedita maxime molestiae, nihil nisi nulla. Accusantium adipisci aspernatur consequuntur dolorem doloribus error hic illo illum iusto magni, mollitia natus nulla perspiciatis porro, ullam voluptate, voluptatum! Accusamus aliquam asperiores aspernatur aut consectetur cumque eligendi eum ex exercitationem fugiat fugit inventore iure magnam obcaecati, officia officiis omnis perferendis perspiciatis porro quam quas qui quibusdam recusandae repellat rerum sed sunt vel. Asperiores est in magnam magni pariatur porro qui sapiente tempora temporibus veniam. Aliquam amet debitis, dolor facilis inventore laudantium minima nemo officia optio perspiciatis porro praesentium, quos sunt ut, velit.';

    function toMenu() {
      console.log('to menu');
      $state.go('menu')
    }
  }

})();
