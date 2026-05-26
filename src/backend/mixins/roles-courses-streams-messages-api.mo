import Types "../types/core";
import RCSMLib "../lib/roles-courses-streams-messages";
import List "mo:core/List";
import Time "mo:core/Time";

mixin (
  educators : List.List<Types.Educator>,
  courses : List.List<Types.Course>,
  lessons : List.List<Types.Lesson>,
  enrollments : List.List<Types.Enrollment>,
  certifications : List.List<Types.Certification>,
  liveStreams : List.List<Types.LiveStream>,
  directMessages : List.List<Types.DirectMessage>,
  conversations : List.List<Types.Conversation>,
  notifications : List.List<Types.Notification>,
) {
  var nextCourseId : Nat = 13; // seed data uses 1-12
  var nextEnrollmentId : Nat = 1;
  var nextCertificationId : Nat = 1;
  var nextStreamId : Nat = 4; // seed data uses 1-3
  var nextDirectMessageId : Nat = 1;
  var nextConversationId : Nat = 1;
  var nextNotificationId : Nat = 1;

  // ── Read: Educators ───────────────────────────────────────────────────────

  public query func getEducators() : async [Types.Educator] {
    RCSMLib.getEducators(educators)
  };

  public query func getEducatorById(id : Nat) : async ?Types.Educator {
    RCSMLib.getEducatorById(educators, id)
  };

  // ── Read: Courses ─────────────────────────────────────────────────────────

  public query func getCourses() : async [Types.Course] {
    RCSMLib.getCourses(courses)
  };

  public query func getCourseById(id : Nat) : async ?Types.Course {
    RCSMLib.getCourseById(courses, id)
  };

  // ── Read: Lessons ─────────────────────────────────────────────────────────

  public query func getLessonsByCourse(courseId : Nat) : async [Types.Lesson] {
    RCSMLib.getLessonsByCourse(lessons, courseId)
  };

  // ── Read: Enrollments ─────────────────────────────────────────────────────

  public query func getEnrollmentsByUser(userId : Nat) : async [Types.Enrollment] {
    RCSMLib.getEnrollmentsByUser(enrollments, userId)
  };

  // ── Read: Certifications ──────────────────────────────────────────────────

  public query func getCertificationsByUser(userId : Nat) : async [Types.Certification] {
    RCSMLib.getCertificationsByUser(certifications, userId)
  };

  // ── Read: Live Streams ────────────────────────────────────────────────────

  public query func getLiveStreams() : async [Types.LiveStream] {
    RCSMLib.getLiveStreams(liveStreams)
  };

  // ── Read: Conversations & Direct Messages ─────────────────────────────────

  public query func getConversations(userId : Nat) : async [Types.Conversation] {
    RCSMLib.getConversations(conversations, userId)
  };

  public query func getDirectMessages(conversationId : Nat) : async [Types.DirectMessage] {
    RCSMLib.getDirectMessages(directMessages, conversationId)
  };

  // ── Read: Notifications ───────────────────────────────────────────────────

  public query func getNotifications(userId : Nat) : async [Types.Notification] {
    RCSMLib.getNotifications(notifications, userId)
  };

  // ── Write: Courses ────────────────────────────────────────────────────────

  public shared func createCourse(input : Types.CreateCourseInput) : async Types.Course {
    let course = RCSMLib.createCourse(courses, nextCourseId, input, Time.now());
    nextCourseId += 1;
    course
  };

  // ── Write: Enrollments ────────────────────────────────────────────────────

  public shared func enrollInCourse(input : Types.CreateEnrollmentInput) : async Types.Enrollment {
    let enrollment = RCSMLib.createEnrollment(enrollments, nextEnrollmentId, input, Time.now());
    nextEnrollmentId += 1;
    enrollment
  };

  // ── Write: Live Streams ───────────────────────────────────────────────────

  public shared func createLiveStream(input : Types.CreateLiveStreamInput) : async Types.LiveStream {
    let stream = RCSMLib.createLiveStream(liveStreams, nextStreamId, input, Time.now());
    nextStreamId += 1;
    stream
  };

  // ── Write: Direct Messages ────────────────────────────────────────────────

  public shared func sendDirectMessage(input : Types.CreateDirectMessageInput) : async Types.DirectMessage {
    let msg = RCSMLib.sendDirectMessage(
      directMessages,
      conversations,
      nextDirectMessageId,
      nextConversationId,
      input,
      Time.now(),
    );
    nextDirectMessageId += 1;
    nextConversationId += 1;
    msg
  };

  // ── Write: Notifications ──────────────────────────────────────────────────

  public shared func createNotification(input : Types.CreateNotificationInput) : async Types.Notification {
    let notif = RCSMLib.createNotification(notifications, nextNotificationId, input, Time.now());
    nextNotificationId += 1;
    notif
  };

  public shared func markNotificationRead(notifId : Nat) : async Bool {
    RCSMLib.markNotificationRead(notifications, notifId)
  };
};
