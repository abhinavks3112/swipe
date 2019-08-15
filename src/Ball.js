import React, { Component } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

class Ball extends Component {
    constructor(props) {
        super(props);
        this.position = new Animated.ValueXY(0, 0);        
    }

    componentDidMount() {
        Animated.spring(this.position, {
            toValue: { x: 200, y: 500 }
        }).start();
    }

    render() {
        return (
        <Animated.View style={this.position.getLayout()}>
            <View style={styles.ball} />
        </Animated.View>
        );
    }
}

const styles = StyleSheet.create({
    ball: {
        height: 60,
        width: 60,
        borderColor: 'black',
        borderRadius: 100,
        borderWidth: 30
    }
});

export default Ball;
