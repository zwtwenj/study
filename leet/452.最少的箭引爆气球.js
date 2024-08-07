/**
 * @param {number[][]} points
 * @return {number}
 */
var findMinArrowShots = function(points) {
    points.sort((a, b) => a[1] - b[1])
    let a = points[0][1]
    let count = 1
    for (let i = 1; i < points.length; i++) {
        let point = points[i]
        if (point[0] > a) {
            count += 1
            a = point[1]
        }
    }
    console.log(count)
};

let points = [[3,9],[7,12],[3,8],[6,8],[9,10],[2,9],[0,9],[3,9],[0,6],[2,8]]
findMinArrowShots(points)