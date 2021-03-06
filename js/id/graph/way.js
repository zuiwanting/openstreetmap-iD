iD.Way = iD.Entity.extend({
    type: "way",
    nodes: [],

    extent: function(resolver) {
        return resolver.transient(this, 'extent', function() {
            var extent = iD.geo.Extent();
            for (var i = 0, l = this.nodes.length; i < l; i++) {
                var node = this.nodes[i];
                if (node.loc === undefined) node = resolver.entity(node);
                extent = extent.extend(node.loc);
            }
            return extent;
        });
    },

    first: function() {
        return this.nodes[0];
    },

    last: function() {
        return this.nodes[this.nodes.length - 1];
    },

    contains: function(node) {
        return this.nodes.indexOf(node) >= 0;
    },

    isOneWay: function() {
        return this.tags.oneway === 'yes';
    },

    isClosed: function() {
        return this.nodes.length > 0 && this.first() === this.last();
    },

    // a way is an area if:
    //
    // - area=yes
    // - closed and
    //   - doesn't have area=no
    //   - doesn't have highway tag
    isArea: function() {
        return this.tags.area === 'yes' ||
            (this.isClosed() &&
                this.tags.area !== 'no' &&
                !this.tags.highway &&
                !this.tags.barrier);
    },

    geometry: function() {
        return this.isArea() ? 'area' : 'line';
    }
});
