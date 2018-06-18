## Generating Pairs

We have the concept of team members and guests.

Members are always considered whether they are present or not (ie. they can solo).

Guests are only considered if they are present (ie. they are not allowed to solo).

Solo guests makes no sense. So, if a guest is present and it is calculated they would solo they are added as a third pair to a random pair of team members -> they make a mob.

Otherwise the guest is normally paired with a team member.

Team members area allowed to solo.

Team members can also elect to mob.

We may want to add some information to the user preferences to indicate solo preferences (solo, open to mobbing etc).

## Cross Team Pairing (Manual)

MVP approach.

Team members who are soloing can search for other teams in their organization who have a pair opportunity available (one of their team members is also soloing) and can reach out to that team to see if today is a good day to cross team pair.

## Auutomatic Cross Team Pairing Thoughts

Team members who have indicated they would like to cross team pair and who are marked to solo in their primary team for the day will be eligible to cross team pair.

Pairity will look across teams in the same organization for other team members who have been chosen to solo.

Note that the time of day this determination is made will vary depending on when teams hold stand up and choose pairs, time zone and other factors.

So the cross team pairing approach must also have an event component,where a notification (email) is sent to discovered soloing team members who have also said they are interested in cross team pairing with a link to accept or reject pair suggestion.

Additionally the person targeted by this notification may not be monitoring their email. So the event notification should expire with in 30 minutes or by some team preference expiration value. 

Once a cross team event expires the process is started over again or the manual process is fallen back to. Approach TBD.