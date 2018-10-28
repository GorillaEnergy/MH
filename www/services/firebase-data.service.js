;(function () {
    'use strict';

    angular
        .module('service.firebaseDataSvc', [])
        .service('firebaseDataSvc', firebaseDataSvc);

    firebaseDataSvc.$inject = ['http', 'url', 'toastr', 'firebaseSvc'];

    function firebaseDataSvc(http, url, toastr, firebaseSvc) {
        var model = {
            onTotalUnreadPsy: onTotalUnreadPsy,
            onTotalUnreadKid: onTotalUnreadKid,
            psychologAccess: psychologAccess,
            watchOnline: watchOnline,
            setTotalUnreadKid: setTotalUnreadKid,
            setMessages: setMessages,
            setTotalUnreadPsy: setTotalUnreadPsy,
            setMarkAsRead: setMarkAsRead,
            removeWatch: removeWatch,
            getMessages: getMessages,
            getMoreMessages: getMoreMessages,
            onMessagesEvent: onMessagesEvent,
            onRemoveMessagesEvent: onRemoveMessagesEvent,
            onChangeMessagesEvent: onChangeMessagesEvent,
            onCheckMissedNumberPsy: onCheckMissedNumberPsy,
            onCheckMissedNumberChild: onCheckMissedNumberChild,
            onLogs: onLogs,
            getLogs: getLogs,
            getLogs2: getLogs2,
            onLogsEvent: onLogsEvent,
            onRemoveLogs: onRemoveLogs,
            onLogsAdded: onLogsAdded,
            onComment: onComment,
            setOnlineStatus: setOnlineStatus,
            watchInvites: watchInvites,
            getUserMetadata: getUserMetadata,
            setAnswer: setAnswer,
            removeMetadata: removeMetadata,
            off: off,
            removeAnswerWatch: removeAnswerWatch,
            getInviteFrom: getInviteFrom,
            setMetadataInvite: setMetadataInvite,
            setInviteFrom: setInviteFrom,
            setMetadataNumber: setMetadataNumber,
            onAnswerChange: onAnswerChange,
            setMetadataCancel: setMetadataCancel,
            onMetadataCancel: onMetadataCancel,
            setAccess: setAccess,
            pushMessages: pushMessages,
            onLastMessages: onLastMessages
        };

        var fb = firebaseSvc.db();

        function onLastMessages(kid_id, psy_id, count, callback) {
            fb.ref('/chats/' + kid_id + '/' + psy_id + '/messages').limitToLast(count).on('value', (snapshot) => {
                callback(snapshot.val());
            });
        }

        function pushMessages(kid_id, psy_id, messages) {
            fb.ref('/chats/' + kid_id + '/' + psy_id).push(messages);
        }

        function setAccess(kid_id, psy_id, status) {
            fb.ref('/chats/' + kid_id + '/' + psy_id + '/access').set(status);
        }

        function onTotalUnreadKid(kid_id, spy_id, callback) {
            fb.ref('/chats/' + kid_id + '/' + psy_id + '/total_unread_kid').on('value', (snapshot) => {
                callback(snapshot.val());
            });
        }

        function psychologAccess(kid_id, psy_id, callback) {
            fb.ref('/chats/' + kid_id + '/' + psy_id + '/access').on('value', (snapshot) => {
                callback(snapshot.val());
            });
        }

        function setTotalUnreadKid(kid_id, psy_id, total_unread_kid) {
            fb.ref('/chats/' + kid_id + '/' + psy_id + '/total_unread_kid').set(total_unread_kid);
        }

        function setMessages(kid_id, psy_id, data) {
            fb.ref('/chats/' + kid_id + '/' + psy_id + '/messages').push(data);
        }

        function setTotalUnreadPsy(kid_id, psy_id, total) {
            fb.ref('/chats/' + kid_id + '/' + psy_id + '/total_unread_psy').set(total);
        }

        function onTotalUnreadPsy(kid_id, psy_id, callback) {
            fb.ref('/chats/' + kid_id + '/' + psy_id + '/total_unread_psy').on('value', (snapshot) => {
                callback(snapshot.val());
            });
        }

        function setMarkAsRead(kid_id, psy_id, key) {
            fb.ref('/chats/' + kid_id + '/' + psy_id + '/messages/' + key + '/read').set(true);
        }

        function removeWatch(kid_id, psy_id) {
            fb.ref('/chats/' + kid_id + '/' + psy_id + '/access').off();
            fb.ref('/chats/' + kid_id + '/' + psy_id + '/messages').off();
            fb.ref('/logs/' + kid_id).off();
        }

        function getMessages(kid_id, psy_id, number_of_posts, callback) {
            fb.ref('/chats/' + kid_id + '/' + psy_id + '/messages').limitToLast(number_of_posts).once('value', (snapshot) => {
                callback(snapshot.val());
            });
        }

        function getMoreMessages(kid_id, psy_id, last, download_more, callback) {
            fb.ref('/chats/' + kid_id + '/' + psy_id + '/messages')
                .orderByChild("date").endAt(last)
                .limitToLast(download_more).once('value', (snapshot) => {
                callback(snapshot.val());
            });
        }

        function onMessagesEvent(kid_id, psy_id, callback) {
            fb.ref('/chats/' + kid_id + '/' + psy_id + '/messages').limitToLast(1).on('child_added', (snapshot) => {
                callback(snapshot);
            });
        }

        function onRemoveMessagesEvent(kid_id, psy_id, callback) {
            fb.ref('/chats/' + kid_id + '/' + psy_id + '/messages').on('child_removed', (snapshot) => {
                callback(snapshot.val());
            });
        }

        function onChangeMessagesEvent(kid_id, psy_id, callback) {
            fb.ref('/chats/' + kid_id + '/' + psy_id + '/messages').on('child_changed', (snapshot) => {
                callback(snapshot.val());
            });
        }

        function onCheckMissedNumberPsy(kid_id, psy_id, callback) {
            fb.ref('/chats/' + kid_id + '/' + psy_id + '/total_unread_psy').on('value', (snapshot) => {
                callback(snapshot.val());
            });
        }

        function onCheckMissedNumberChild(kid_id, psy_id, callback) {
            fb.ref('/chats/' + kid_id + '/' + psy_id + '/total_unread_kid').on('value', (snapshot) => {
                callback(snapshot.val());
            });
        }

        //Logs -------------------------------------------------------------------------------

        function onRemoveLogs(kid_id, callback) {
            fb.ref('/logs/' + kid_id).on('child_removed', (snapshot) => {
                callback(snapshot.val());
            });
        }

        function onLogs(kid_id, number_of_logs, callback) {
            fb.ref('/logs/' + kid_id).limitToLast(number_of_logs).on('value', (snapshot) => {
                callback(snapshot.val());
            });
        }

        function onLogsEvent(kid_id, callback) {
            fb.ref('/logs/' + kid_id).limitToLast(1).on('child_added', (snapshot) => {
                callback(snapshot.val());
            });
        }

        function getLogs(id, number_of_logs, callback) {
            fb.ref('/logs/' + id).limitToLast(number_of_logs).once('value', (snapshot) => {
                callback(snapshot.val());
            });
        }

        function onComment(kid_id, number_of_logs, callback) {
            fb.ref('/logs/' + kid_id).limitToLast(number_of_logs).on('value', (snapshot) => {
                callback(snapshot.val());
            });
        }

        function getLogs2(kid_id, last, coutn, callback) {
            fb.ref('/logs/' + kid_id).orderByChild("id").endAt(last).limitToLast(count).once('value', (snapshot) => {
                callback(snapshot.val());
            });
        }

        function onLogsAdded(kid_id, callback) {
            fb.ref('/logs/' + kid_id).on('child_changed', (snapshot) => {
                callback(snapshot.val());
            });
        }

        //WebRTC ----------------------------------------------------------------------------------

        function watchOnline(user_id, callback) {
            fb.ref('/WebRTC/users/' + user_id + '/online').on('value', (snapshot) => {
                callback(snapshot.val());
            });
        }

        function watchInvites(user_id, callback) {
            fb.ref('/WebRTC/users/' + user_id + '/metadata/invite').on('value', (snapshot) => {
                callback(snapshot.val());
            });
        }

        function getInviteFrom(user_id, callback) {
            fb.ref('/WebRTC/users/' + user_id + '/metadata/invite_from').once('value', (snapshot) => {
                callback(snapshot.val());
            });
        }

        function getUserMetadata(user_id, callback) {
            fb.ref('/WebRTC/users/' + user_id + '/metadata').once('value', (snapshot) => {
                callback(snapshot.val());
            });
        }

        function setOnlineStatus(user_id, status) {
            fb.ref('/WebRTC/users/' + user_id + '/online').set(status);
            console.log(status && 'Online' || !status && 'Offline');
        }

        function setMetadataInvite(opponent_id, call_from_user) {
            fb.ref('/WebRTC/users/' + opponent_id + '/metadata/invite').set(call_from_user);
        }

        function setInviteFrom(opponent_id, user_name) {
            fb.ref('/WebRTC/users/' + opponent_id + '/metadata/invite_from').set(user_name);
        }

        function setMetadataNumber(opponent_id, user_id) {
            fb.ref('/WebRTC/users/' + opponent_id + '/metadata/number').set(user_id);
        }

        function onAnswerChange(opponent_id, callback) {
            fb.ref('/WebRTC/users/' + opponent_id + '/metadata/answer').on('value', (snapshot) => {
                callback(snapshot.val());
            });
        }

        function setAnswer(user_id, answer) {
            fb.ref('/WebRTC/users/' + user_id + '/metadata/answer').set(answer);
        }

        function removeMetadata(user_id) {
            fb.ref('/WebRTC/users/' + user_id + '/metadata').remove();
        }

        function off() {
            fb.ref().off();
        }

        function removeAnswerWatch(id) {
            fb.ref('/WebRTC/users/' + id + '/metadata/answer').off();
        }

        function setMetadataCancel(id) {
            fb.ref('/WebRTC/users/' + id + '/metadata/cancel').set(true);
        }

        function onMetadataCancel(id, callback) {
            fb.ref('/WebRTC/users/' + id + '/metadata/cancel').on('value', (snapshot) => {
                callback(snapshot.val());
            });
        }

        return model;
    }
})();