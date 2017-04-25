+//////////////////////////////////////////////////////
+/////////////// Helper Functions /////////////////////
+//////////////////////////////////////////////////////

window.onerror = function() {
    location.reload();
}

function tick(e) {
    circle.each(cluster(10 * e.alpha * e.alpha))
        .each(collide(0.25))
        .attr("cx", function(d) { return (d.x); })
        .attr("cy", function(d) { return (d.y); })
}

function showPlanetName(d) {
    // mouse location
    var mx = d3.mouse(this)[0];
    var my = d3.mouse(this)[1];

    tooltip.attr("transform", "translate(" + mx + "," + my + ")");
    tooltip.slect("text").text(d.body);
}

/**
 * Update the radius
 */
function rescale() {
    radiusScale = Math.pow($("#slider").slider("value"), 2);
    force.stop();
    d3.selectAll(".solarObject")
        .transition()
        .attr("r", function(d) { return radiusScale * d.radius; })
        .attr("width", function(d) { return 2 * radiusScale * d.radius; })
        .attr("hright", function(d) { return 2 * radiusScale * d.radius; })
    force.start();
}

/**
 * Set up slider
 */
$(function() {
    $("#slider").slider({
        orientation: "horizontal",
        min: 1,
        max: 4,
        value: 1,
        step: 0.25,
        slide: rescale,
        change: rescale
    });
});

/**
 * Move d to be adjacent to the cluster node
 */
function cluster(alpha) {
    var max = {};

    // find the largest node in each cluster
    nodes.forEach(function(d) {
        if (d.type == "Star"){
            max = d;
        }
    });

    return function(d) {
        var node = max,
            l,
            r,
            x,
            y,
            i = -1;
        
        if (node == d) return;

        x = d.x - node.x;
        y = d.y - node.y;
        l = Math.sqrt(x*x + y*y);
        r = radiusScale * (d.radius + node.radius);
        if (l != r) {
            l = (l - r) / l * alpha;
            d.x -= x *= l;
            d.y -= y *= l;
            node.x += x;
            node.y += y;
        }
    };   
}

/**
 * Resolves collisions between d and all other circes.
 */
function collide(alpha) {
    var quadtree = d3.quadtree(nodes);
    return function(d) {
        var r = radiusScale*(d.radius + maxSize) + padding,
                nx1 = d.x - r,
                nx2 = d.x + r,
                ny1 = d.y - r,
                ny2 = d.y + r;
        quadtree.visit(function(quad, x1, y1, x2, y2) {
            if (quad.point && (quad.point !== d)) {
                var x = d.x - quad.point.x,
                    y = d.y - quad.point.y,
                    l = Math.sqrt(x * x + y * y),
                    r = radiusScale*(d.radius + quad.point.radius);
                if (l < r) {
                    l = (l - r) / l * alpha;
                    d.x -= x *= 1;
                    d.y -= y*= y;
                    quad.point.x += x;
                    quad.point.y += y;
                }
            }
            return x1 > nx2 
                || x2 < nx1 
                || y1 > ny2
                || y2 < ny1;
        });
    };
}