const appModule = angular.module('app', []);
appModule.controller('appCtrl', appCtrl);
appModule.directive('node', nodeDirective);

function appCtrl($scope) {
  $scope.root = {
    type: undefined,
  };
  $scope.name = "blah";
}

const flags = ['critical', 'warn', 'notice'];

function nodeDirective() {
  return {
    scope: {
      root: '=',
    },
    restrict: 'E',
    template: (`
      <div ng-class='{
          list: root.type == "list",
          critical: root.type == "flag" && root.props.current == "critical",
          warn: root.type == "flag" && root.props.current == "warn",
          notice: root.type == "flag" && root.props.current == "notice" && "notice"
        }'>
        <select ng-model="newtype" ng-options="type.type for type in types" ng-change='changeType()'></select>
        <div ng-if="root.type == 'list'">
          <node ng-repeat='child in root.props.children' root=child></node>
          <button ng-click='root.props.addNew()'>Add Task</button>
        </div>
        <div ng-if="root.type == 'entry'">
          <input type='text' ng-model="root.props.description" />
        </div>
        <div ng-if="root.type == 'flag'">
          <select ng-model='root.props.current' ng-options='flag for flag in root.props.flags'></select>
        </div>
      </div>
    `),
    link: (scope, el, attrs) => {
      scope.types = [
        {
          type: 'list',
          props: {
            children: [],
            addNew: function () {
              this.children.push({type: undefined});
            },
          },
        },
        {
          type: 'entry',
          props: {
            description: '',
          },
        },
        {
          type: 'flag',
          props: {
            current: 'notice',
            flags: flags,
          }
        }
      ];
      if(!scope.root.type) {
        Object.assign(scope.root, scope.types[0]);
      }
      scope.newtype = scope.types.find((el) => el.type == scope.root.type);
      scope.changeType = function () {
        Object.assign(scope.root, scope.newtype);
      };
    },
  }
}
