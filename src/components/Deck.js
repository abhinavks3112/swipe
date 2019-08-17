import React, { Component } from 'react';
import { 
    View, 
    Animated,
    PanResponder,
    Dimensions
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;

class Deck extends Component {
    constructor(props) {
        super(props);
        this._position = new Animated.ValueXY();      
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (event, gesture) => {
                this._position.setValue({ x: gesture.dx, y: gesture.dy });
            },
            onPanResponderRelease: (event, gesture) => {
                if (gesture.dx > SWIPE_THRESHOLD) {
                  console.log('swipe right');
                } else if (gesture.dx < -SWIPE_THRESHOLD) {
                    console.log('swipe left');
                } else {
                    this.resetPosition();
                }
            }
        });
    }  

    getCardStyle = () => {
        const { _position } = this;
        const rotate = _position.x.interpolate({
            inputRange: [-SCREEN_WIDTH * 3, 0, SCREEN_WIDTH * 3],
            outputRange: ['-120deg', '0deg', '120deg']
        });
        return ({
            ..._position.getLayout(),
            transform: [{ rotate }]
        });
    }

    resetPosition = () => {
        return Animated.spring(this._position, {
            toValue: { x: 0, y: 0 }
        }).start();
    } 

    renderCard = () => {
        return this.props.data.map((item, index) => {
            if (index === 0) {
              return (
                <Animated.View
                key={item.id}
                style={this.getCardStyle()}
                {...this._panResponder.panHandlers}
                >
                   { this.props.renderCard(item)}
                </Animated.View>  
                );
            }
            return this.props.renderCard(item);
        });
    }
    render() {
        return (
            <View>
                {this.renderCard()}
            </View>
        );
    }
}

export default Deck;
