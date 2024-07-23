/**
 * @param {TreeNode} root
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {TreeNode}
 */
var lowestCommonAncestor = function(root, p, q) {
    if (root == null) { // 遇到null，返回null 没有LCA
        return null;
    }
    if (root == q || root == p) { // 遇到p或q，直接返回当前节点
        return root;
    }
    // 非null 非q 非p，则递归左右子树
    const left = lowestCommonAncestor(root.left, p, q);
    const right = lowestCommonAncestor(root.right, p, q);
    // 根据递归的结果，决定谁是LCA
    if (left && right) {
        return root;
    }
    if (left == null) {
        return right;
    }
    return left;
};

let root = [3,5,1,6,2,0,8,null,null,7,4]
let p = 5
let q = 1

console.log(lowestCommonAncestor(root, p, q))