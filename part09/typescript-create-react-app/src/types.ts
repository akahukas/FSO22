interface CoursePartBase {
  name: string;
  exerciseCount: number;
  type: string;
}

interface CoursePartWithDescription extends CoursePartBase {
  description: string;
}

interface SpecialCoursePart {
  name: string;
  exerciseCount: number;
  description: string;
  requirements: Array<string>;
  type: "special";
}

interface CourseNormalPart extends CoursePartWithDescription {
  type: "normal";
}
interface CourseProjectPart extends CoursePartBase {
  type: "groupProject";
  groupProjectCount: number;
}

interface CourseSubmissionPart extends CoursePartWithDescription {
  type: "submission";
  exerciseSubmissionLink: string;
}

export type CoursePart = CourseNormalPart | CourseProjectPart | CourseSubmissionPart | SpecialCoursePart;